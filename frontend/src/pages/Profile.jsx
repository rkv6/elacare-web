import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, doc, getDoc, setDoc, updateProfile, auth } from '../services/firebase';
import { Edit2, Save, X, UserCircle, Loader, MapPin, Camera } from 'lucide-react';

export default function Profile() {
  const { user, refreshUser, profilePhoto: ctxPhoto, setProfilePhoto } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    farmName: '',
    yearsExperience: '',
    preferredLanguage: 'English'
  });
  const [saved, setSaved] = useState(false);
  const [locating, setLocating] = useState(false);
  const [photoURL, setPhotoURL] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Sync context photo into local state
  useEffect(() => {
    if (ctxPhoto) setPhotoURL(ctxPhoto);
  }, [ctxPhoto]);

  const detectLocation = async () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    try {
      const pos = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 })
      );
      const { latitude, longitude } = pos.coords;
      // Reverse geocode via free Nominatim API
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=10`
      );
      const data = await res.json();
      const addr = data.address || {};
      const parts = [
        addr.city || addr.town || addr.village || addr.county || '',
        addr.state || addr.state_district || '',
        addr.country || ''
      ].filter(Boolean);
      const locationStr = parts.join(', ') || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      handleChange('location', locationStr);
    } catch (err) {
      console.error('Location detection failed:', err);
    } finally {
      setLocating(false);
    }
  };

  // Load profile from Firestore on mount
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPhotoURL(data.photoURL || user.photoURL || '');
          setProfile({
            name: data.name || user.displayName || '',
            email: data.email || user.email || '',
            phone: data.phone || '',
            location: data.location || '',
            farmName: data.farmName || '',
            yearsExperience: data.yearsExperience || '',
            preferredLanguage: data.preferredLanguage || 'English'
          });
        } else {
          // No Firestore doc yet — use Firebase Auth data
          setProfile(prev => ({
            ...prev,
            name: user.displayName || '',
            email: user.email || ''
          }));
          setPhotoURL(user.photoURL || '');
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
        setProfile(prev => ({
          ...prev,
          name: user.displayName || '',
          email: user.email || ''
        }));
        setPhotoURL(user.photoURL || '');
      } finally {
        setProfileLoading(false);
      }
    };
    loadProfile();
  }, [user]);

  // Auto-detect location if empty after profile loads
  useEffect(() => {
    if (!profileLoading && !profile.location) {
      detectLocation();
    }
  }, [profileLoading]);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be under 5MB');
      return;
    }
    setUploadingPhoto(true);
    try {
      // Compress and convert to base64 data URL
      const dataUrl = await compressImage(file, 256, 0.8);
      setPhotoURL(dataUrl);
      // Save to Firestore only (Firebase Auth photoURL rejects data URLs)
      await setDoc(doc(db, 'users', user.uid), { photoURL: dataUrl, updatedAt: new Date().toISOString() }, { merge: true });
      setProfilePhoto(dataUrl);
    } catch (err) {
      console.error('Photo upload failed:', err);
      alert('Failed to upload photo. Please try again.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Resize + compress image to base64
  const compressImage = (file, maxSize, quality) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let w = img.width, h = img.height;
          if (w > h) { if (w > maxSize) { h = Math.round(h * maxSize / w); w = maxSize; } }
          else { if (h > maxSize) { w = Math.round(w * maxSize / h); h = maxSize; } }
          canvas.width = w;
          canvas.height = h;
          canvas.getContext('2d').drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleChange = (field, value) => setProfile(prev => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      // Save to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        ...profile,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      // Update Firebase Auth displayName
      if (profile.name !== user.displayName) {
        await updateProfile(auth.currentUser, { displayName: profile.name });
        refreshUser();
      }

      setSaved(true);
      setIsEditing(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed to save profile:', err);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-gray-900 text-sm transition-colors";

  const renderField = (label, field, type = 'text') => (
    <div key={field}>
      <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">{label}</label>
      {isEditing ? (
        <input type={type} value={profile[field]} onChange={(e) => handleChange(field, e.target.value)} className={inputClass} />
      ) : (
        <p className="text-sm text-gray-900 py-1">{profile[field]}{field === 'yearsExperience' ? ' years' : ''}</p>
      )}
    </div>
  );

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-auto">
          <div className="max-w-3xl mx-auto px-6 sm:px-8 py-8 sm:py-12">
            {/* Header */}
            <div className="mb-10">
              <p className="section-label mb-2">Account</p>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">My Profile</h1>
              <p className="text-sm text-gray-500">Manage your personal and farm information</p>
            </div>

            {saved && (
              <div className="bento-card mb-6 border-emerald-200! bg-emerald-50/50!">
                <p className="text-sm font-semibold text-emerald-800">Profile updated successfully</p>
              </div>
            )}

            {profileLoading ? (
              <div className="bento-card flex items-center justify-center py-16">
                <Loader className="animate-spin text-emerald-600 mr-3" size={20} />
                <span className="text-sm text-gray-500 font-mono">Loading profile...</span>
              </div>
            ) : (
            <div className="bento-card">
              {/* Profile Header */}
              <div className="flex items-start justify-between mb-8 pb-8 border-b border-gray-100">
                <div className="flex items-center gap-5">
                  <div className="relative group">
                    {photoURL ? (
                      <img src={photoURL} alt="Profile" className="w-16 h-16 rounded-2xl object-cover" />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center">
                        <span className="text-emerald-700 font-bold text-2xl font-mono">{(profile.name || '?').charAt(0)}</span>
                      </div>
                    )}
                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                      {uploadingPhoto ? (
                        <Loader size={18} className="text-white animate-spin" />
                      ) : (
                        <Camera size={18} className="text-white" />
                      )}
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" disabled={uploadingPhoto} />
                    </label>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
                    <p className="text-sm text-gray-500 font-mono">{profile.farmName}</p>
                  </div>
                </div>
                {!isEditing ? (
                  <button onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                    <Edit2 size={14} /> Edit
                  </button>
                ) : (
                  <button onClick={() => setIsEditing(false)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors">
                    <X size={14} /> Cancel
                  </button>
                )}
              </div>

              {/* Fields */}
              <div className="space-y-5">
                {renderField('Full Name', 'name')}
                {renderField('Email', 'email', 'email')}
                {renderField('Phone', 'phone', 'tel')}
                {/* Location field with detect button */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Location</label>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <input type="text" value={profile.location} onChange={(e) => handleChange('location', e.target.value)} className={inputClass} />
                      <button type="button" onClick={detectLocation} disabled={locating}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-colors disabled:opacity-50 whitespace-nowrap">
                        {locating ? <Loader size={13} className="animate-spin" /> : <MapPin size={13} />}
                        {locating ? 'Detecting...' : 'Detect'}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {profile.location ? (
                        <>
                          <MapPin size={14} className="text-emerald-600 shrink-0" />
                          <p className="text-sm text-gray-900 py-1">{profile.location}</p>
                        </>
                      ) : (
                        <p className="text-sm text-gray-400 py-1 italic">No location set</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <p className="section-label mb-5">Farm Information</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {renderField('Farm Name', 'farmName')}
                    {renderField('Years of Experience', 'yearsExperience', 'number')}
                  </div>
                </div>

                {isEditing && (
                  <div className="pt-4">
                    <button onClick={handleSave} disabled={saving}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50">
                      {saving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>
            </div>
            )}

            {/* Danger Zone */}
            <div className="bento-card mt-6 border-red-100!">
              <p className="text-xs font-semibold text-red-800 uppercase tracking-wide mb-3">Danger Zone</p>
              <button className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
