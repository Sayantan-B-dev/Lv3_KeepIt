import { useRef, useEffect } from "react";
import { toast } from "react-toastify";
import axiosInstance from "@/api/axiosInstance";
;

const UPLOAD_QUEUE_KEY = "mdUploadQueue";

export default function useMarkdownUploadQueue(categoryId, setNotes) {
  const processingRef = useRef(false);

  const getUploadQueue = () => {
    try {
      const q = localStorage.getItem(UPLOAD_QUEUE_KEY);
      return q ? JSON.parse(q) : [];
    } catch {
      return [];
    }
  };

  const setUploadQueue = (queue) => {
    localStorage.setItem(UPLOAD_QUEUE_KEY, JSON.stringify(queue));
  };

  const clearUploadQueue = () => {
    localStorage.removeItem(UPLOAD_QUEUE_KEY);
  };

  const readFilesAsText = (files) =>
    Promise.all(
      files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () =>
              resolve({ name: file.name, content: reader.result });
            reader.onerror = () =>
              reject(new Error(`Failed to read ${file.name}`));
            reader.readAsText(file);
          })
      )
    );

  const handleUpload = async (e, filesOverride) => {
    const files = filesOverride || Array.from(e.target.files || []);
    if (!files.length) return;

    try {
      const filesData = await readFilesAsText(files);
      let queue = getUploadQueue();

      const existingNames = new Set(
        queue.filter(q => q.categoryId === categoryId).map(q => q.name)
      );

      let addedAny = false;

      filesData.forEach(f => {
        if (existingNames.has(f.name)) {
          toast.info(`"${f.name}" already in upload queue`, { autoClose: 4000 });
        } else {
          queue.push({
            name: f.name,
            content: f.content,
            categoryId
          });
          existingNames.add(f.name);
          addedAny = true;
        }
      });

      setUploadQueue(queue);

      if (addedAny && !processingRef.current) {
        processQueue();
      }
    } catch (err) {
      toast.error(err.message || "Failed to read files");
    }

    if (e?.target) e.target.value = "";
  };

  const processQueue = async () => {
    processingRef.current = true;

    let queue = getUploadQueue();
    if (!queue.length) {
      processingRef.current = false;
      clearUploadQueue();
      return;
    }

    const { name, content, categoryId: catId } = queue[0];
    const title = name.replace(/\.md$/i, "");

    let countdown = 5;
    const toastId = toast.info(
      `Uploading "${title}" in ${countdown}s...`,
      { autoClose: false, closeButton: false }
    );

    const interval = setInterval(() => {
      countdown -= 1;
      if (countdown > 0) {
        toast.update(toastId, {
          render: `Uploading "${title}" in ${countdown}s...`
        });
      }
    }, 1000);

    await new Promise(res => setTimeout(res, 5000));
    clearInterval(interval);
    toast.dismiss(toastId);

    try {
      const res = await axiosInstance.post("/api/notes", {
        title,
        content,
        category: catId
      });

      toast.success(`"${title}" uploaded`);

      if (
        res.data.category === catId ||
        res.data.category?._id === catId
      ) {
        setNotes(prev =>
          [...prev, res.data].sort((a, b) =>
            a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
          )
        );
      }
    } catch (err) {
      const isRateLimit = err?.response?.status === 429;
      toast.error(
        err?.response?.data?.error ||
        `Failed to upload "${title}"`
      );

      if (isRateLimit) {
        console.warn("⚠️ Rate limit reached. Stopping upload queue.");
        processingRef.current = false;
        return;
      }
    }

    queue = getUploadQueue();
    queue.shift();
    setUploadQueue(queue);

    if (processingRef.current) {
      setTimeout(processQueue, 400);
    }
  };

  const resumeQueue = () => {
    if (!processingRef.current) {
      processQueue();
    }
  }

  // Clear queue on mount (page refresh) - user must manually re-upload
  useEffect(() => {
    clearUploadQueue();
    processingRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on mount

  return {
    handleUpload,
    getUploadQueue,
    clearUploadQueue,
    processingRef,
    resumeQueue
  };
}
