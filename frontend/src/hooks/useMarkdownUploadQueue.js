import { useRef, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "@/api/axiosInstance";
;

const UPLOAD_QUEUE_KEY = "mdUploadQueue";

export default function useMarkdownUploadQueue(categoryId, setNotes, user, onRateLimit) {
  const processingRef = useRef(false);
  const isPro = user?.isPro || user?.isPremium;
  const [uploadReport, setUploadReport] = useState([]);

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
      setUploadReport([]); // Clear previous report when starting a new batch
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
    if (processingRef.current) return;
    processingRef.current = true;

    const concurrencyLimit = isPro ? 5 : 1;
    const gapDelay = isPro ? 3000 : 5000;

    while (true) {
      let queue = getUploadQueue();
      if (!queue.length) {
        break;
      }

      const batch = queue.slice(0, concurrencyLimit);
      
      const promises = batch.map(async (item) => {
        const { name, content, categoryId: catId } = item;
        const title = name.replace(/\.md$/i, "");
        
        try {
          const res = await axiosInstance.post("/api/notes", {
            title,
            content,
            category: catId
          });
          
          if (res.data.category === catId || res.data.category?._id === catId) {
            return { success: true, data: res.data, name };
          }
          return { success: true, data: null, name };
        } catch (err) {
          const isRateLimit = err?.response?.status === 429;
          if (isRateLimit && !isPro && onRateLimit) {
            onRateLimit();
          }
          return { 
            success: false, 
            error: err?.response?.data?.error || `Failed to upload "${title}"`, 
            isRateLimit,
            name
          };
        }
      });

      const results = await Promise.all(promises);
      
      let rateLimited = false;
      const newNotes = [];

      results.forEach(result => {
        if (result.success) {
          toast.success(`"${result.name}" uploaded`);
          if (result.data) newNotes.push(result.data);
          setUploadReport(prev => [...prev, { name: result.name, status: "success", timestamp: new Date().toISOString() }]);
        } else {
          toast.error(result.error);
          if (result.isRateLimit) rateLimited = true;
          setUploadReport(prev => [...prev, { name: result.name, status: "error", error: result.error, timestamp: new Date().toISOString() }]);
        }
      });

      if (newNotes.length > 0) {
        setNotes(prev => {
          const combined = [...prev, ...newNotes];
          const unique = Array.from(new Map(combined.map(item => [item._id, item])).values());
          return unique.sort((a, b) =>
            a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
          );
        });
      }

      // Remove processed items from queue
      let currentQueue = getUploadQueue();
      const processedNames = new Set(batch.map(item => item.name));
      const remainingQueue = currentQueue.filter(item => !processedNames.has(item.name));
      setUploadQueue(remainingQueue);

      if (rateLimited) {
        console.warn("⚠️ Rate limit reached. Stopping upload queue.");
        break;
      }

      if (remainingQueue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, gapDelay));
      }
    }
    
    processingRef.current = false;
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
    resumeQueue,
    uploadReport,
    clearReport: () => setUploadReport([])
  };
}
