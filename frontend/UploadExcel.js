import { useState } from "react";

export default function UploadExcel() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [manoDownload, setManoDownload] = useState(null);
  const [iaDownload, setIaDownload] = useState(null);

  const API_URL = "https://bradypus.onrender.com"; // Reemplázalo con tu URL real

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Por favor, selecciona un archivo.");
      return;
    }
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/upload/`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.error) {
        setMessage("Error: " + data.error);
      } else {
        setMessage("Archivo procesado exitosamente.");
        setManoDownload(`${API_URL}/${data.mano}`);
        setIaDownload(`${API_URL}/${data.ia}`);
      }
    } catch (error) {
      setMessage("Error en la subida del archivo.");
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md w-96 text-center">
        <h2 className="text-xl font-bold mb-4">Sube tu archivo Excel</h2>
        <input type="file" accept=".xlsx" onChange={handleFileChange} className="mb-4" />
        <button
          onClick={handleUpload}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Subir y procesar
        </button>
        {message && <p className="mt-4 text-gray-700">{message}</p>}
        {manoDownload && (
          <a href={manoDownload} download className="block mt-4 text-blue-500 hover:underline">
            Descargar BBDD Mano
          </a>
        )}
        {iaDownload && (
          <a href={iaDownload} download className="block mt-2 text-blue-500 hover:underline">
            Descargar BBDD IA
          </a>
        )}
      </div>
    </div>
  );
}
