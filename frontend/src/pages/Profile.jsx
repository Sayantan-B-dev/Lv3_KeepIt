import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import Loading from "../components/home/Loading";
import { useAuth } from '../context/AuthContext';
import PublicProfileHeader from "../components/myprofile/PublicProfileHeader";
import PublicCategoryList from "../components/myprofile/PublicCategoryList";
import NoteModal from "../components/myprofile/NoteModal";
import { marked } from "marked";
import DOMPurify from "dompurify";

const Profile = () => {
  const { user: loggedInUser } = useAuth();
  const { userId } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [openCategoryId, setOpenCategoryId] = useState(null);
  const [categoryNotes, setCategoryNotes] = useState({}); // { [catId]: [notes] }
  const [notesLoading, setNotesLoading] = useState({}); // { [catId]: bool }
  const [notesError, setNotesError] = useState({}); // { [catId]: string }
  const [openNote, setOpenNote] = useState(null); // note object
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [noteModalLoading, setNoteModalLoading] = useState(false);
  const [noteModalError, setNoteModalError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get(`/api/profile/${userId}`);
        setProfile(res.data);
        setCategories(res.data.categories || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load profile. Please try again later."
        );
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleCategoryDropdown = async (catId) => {
    if (openCategoryId === catId) {
      setOpenCategoryId(null);
      return;
    }
    setOpenCategoryId(catId);
    if (!categoryNotes[catId]) {
      setNotesLoading((prev) => ({ ...prev, [catId]: true }));
      setNotesError((prev) => ({ ...prev, [catId]: null }));
      try {
        const res = await axiosInstance.get(`/api/categories/${catId}`);
        setCategoryNotes((prev) => ({ ...prev, [catId]: res.data.notes || [] }));
      } catch (err) {
        setNotesError((prev) => ({ ...prev, [catId]: err?.response?.data?.message || "Failed to load notes." }));
      } finally {
        setNotesLoading((prev) => ({ ...prev, [catId]: false }));
      }
    }
  };

  // Handle note click: fetch full note if needed, then open modal
  const handleNoteClick = async (note) => {
    setNoteModalLoading(true);
    setNoteModalError(null);
    setNoteModalOpen(true);
    try {
      // If note already has content, use it; otherwise fetch full note
      if (note.content) {
        setOpenNote(note);
      } else {
        const res = await axiosInstance.get(`/api/notes/${note._id}`);
        setOpenNote(res.data);
      }
    } catch (err) {
      setNoteModalError(
        err?.response?.data?.message || err?.message || "Failed to load note."
      );
      setOpenNote(null);
    } finally {
      setNoteModalLoading(false);
    }
  };
  const closeNoteModal = () => {
    setNoteModalOpen(false);
    setOpenNote(null);
    setNoteModalError(null);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <span className="text-red-500">{error}</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <span className="text-gray-500">User not found.</span>
      </div>
    );
  }

  const getWebsiteHref = (website) => {
    if (!website) return "";
    if (/^https?:\/\//i.test(website)) {
      return website;
    }
    if (/^\/\//.test(website)) {
      return website;
    }
    return "//" + website;
  };

  return (
      <>
      <div
        className="mx-auto p-4 sm:p-6 md:p-10 w-[90%] max-w-full md:w-[90%] md:max-w-2xl lg:max-w-3xl bg-gradient-to-br from-white via-indigo-50 to-blue-50 shadow-2xl border border-indigo-100 mt-8 md:mt-10 mb-12 md:mb-16 rounded-3xl md:rounded-[60px] transition-all"
        style={{
          backdropFilter: "blur(2px)",
          backdropShadow: "20px",
          background: "rgba(255, 255, 255, 0.01)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: "0 4px 32px 0 rgba(31, 38, 135, 0.20)",
          borderRadius: "60px",
          border: "1px dashed black",
        }}
      >
        <PublicProfileHeader profile={profile} />
        {/* Profile Details (bio, website) */}
        <div className="flex flex-col justify-start gap-2">
          <div className="flex flex-col sm:flex-row gap-2 items-center">
            <label className="block text-sm font-semibold text-gray-700 mb-1 text-center text-nowrap min-w-[60px]">
              Bio :
            </label>
            <div className="text-xs rounded-xl px-3 py-2 shadow-xl border border-indigo-50 w-full sm:w-fit">
              <p className="text-black" style={{ wordBreak: "break-all" }}>
                {profile.bio ? (
                  `"${profile.bio}"`
                ) : (
                  <span className="italic text-gray-400">No bio</span>
                )}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 items-center">
            <label className="block text-sm font-semibold text-gray-700 mb-1 text-nowrap min-w-[60px]">
              Website :
            </label>
            <div className="text-xs rounded-xl px-3 py-2 shadow-xl border border-indigo-50 w-full sm:w-fit">
              {profile.website ? (
                <a
                  href={getWebsiteHref(profile.website)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black break-all"
                  style={{ wordBreak: "break-all" }}
                >
                  {profile.website}
                </a>
              ) : (
                <span className="italic text-gray-400">No website</span>
              )}
            </div>
          </div>
        </div>
        <PublicCategoryList
          categories={categories}
          openCategoryId={openCategoryId}
          handleCategoryDropdown={handleCategoryDropdown}
          notesLoading={notesLoading}
          notesError={notesError}
          categoryNotes={categoryNotes}
          navigate={navigate}
          handleNoteClick={handleNoteClick}
        />
        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-gray-500 text-sm italic">
            Viewing <span className="font-bold">{profile.username}</span>
            {"'"}s profile.
          </p>
        </div>
      </div>
      <NoteModal
        noteModalOpen={noteModalOpen}
        openNote={openNote}
        closeNoteModal={closeNoteModal}
        noteContentHtml={openNote && openNote.content ?
          DOMPurify.sanitize(
            marked(openNote.content || "", {
              highlight: function (code, lang) {
                return code;
              }
            })
          )
            .replace(
              /<a /g,
              '<a target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: underline; font-weight: 500; word-break: break-all; overflow-wrap: anywhere;" '
            )
            .replace(
              /<pre>/g,
              '<pre style="background: #23272e; color: #f8f8f2; padding: 1em; border-radius: 10px; margin: 1em 0; overflow-x: auto; font-size: 0.97em;">'
            )
            .replace(
              /<pre[^>]*>\s*<code( class=".*?")?>/g,
              '<pre style="background: #23272e; color: #f8f8f2; padding: 1em; border-radius: 10px; margin: 1em 0; overflow-x: auto; font-size: 0.97em;"><code style="background: transparent; color: inherit; padding: 0; border-radius: 0; font-size: inherit;">'
            )
            .replace(
              /<code( class=".*?")?>/g,
              '<code style="background: #f3f4f6; color: #23272e; padding: 2px 6px; border-radius: 4px; font-size: 0.97em; border: 1px solid #e5e7eb;">'
            )
            .replace(
              /<table>/g,
              '<div style="overflow-x:auto; max-width:100vw;"><table style="min-width:400px; width:100%; border-collapse:collapse; margin:1.5em 0; font-size:0.98em; background:#f8fafc; border-radius:10px; overflow:hidden; box-shadow:0 2px 8px 0 rgba(31,38,135,0.05);">'
            )
            .replace(
              /<thead>/g,
              '<thead style="background:#e0e7ef;">'
            )
            .replace(
              /<th>/g,
              '<th style="padding:10px 16px; border-bottom:2px solid #c7d2fe; font-weight:700; text-align:left; color:#1e293b;">'
            )
            .replace(
              /<tr>/g,
              '<tr style="border-bottom:1px solid #e5e7eb;">'
            )
            .replace(
              /<td>/g,
              '<td style="padding:10px 16px; border-bottom:1px solid #e5e7eb; color:#334155; vertical-align:top;">'
            )
            .replace(
              /<\/table>/g,
              '</table></div>'
            ) : ""}
      />
      </>
  );
};

export default Profile;
