import { toast } from "react-toastify";

export const handleProfileImage = (
  file,
  onSuccess,
  options = {}
) => {
  if (!file) return;

  const {
    maxSizeMB = 3,
    allowedTypes = ["image/jpeg", "image/png", "image/jpg"],
  } = options;

  if (!allowedTypes.includes(file.type)) {
    toast.error("Only JPG, JPEG, PNG allowed.");
    return;
  }

  if (file.size > maxSizeMB * 1024 * 1024) {
    toast.error(`Image must be under ${maxSizeMB}MB.`);
    return;
  }

  const reader = new FileReader();
  reader.onloadend = () => {
    onSuccess({
      profileImage: file,
      profileImagePreview: reader.result,
    });
  };

  reader.readAsDataURL(file);
};
