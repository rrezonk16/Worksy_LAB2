const ProfileModal = ({ onClose, onUpload, setFile }) => {
  return (
    <div className="modal-overlay">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-md space-y-4">
        <h3 className="text-xl font-semibold">Upload New Profile Image</h3>
        <div
          className="drag-box"
          onDrop={(e) => {
            e.preventDefault();
            setFile(e.dataTransfer.files[0]);
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          <p>Drag & drop your image here, or click to select</p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
            Cancel
          </button>
          <button onClick={onUpload} className="bg-blue-600 text-white px-4 py-2 rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
