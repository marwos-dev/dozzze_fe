"use client";

import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getRoomById } from "@/store/roomsSlice";
import Image from "next/image";
import { CheckCircle, Users } from "lucide-react";
import { AppDispatch, RootState } from "@/store";
import { useState, useEffect } from "react";
import Spinner from "@/components/ui/spinners/Spinner";
import ImageGalleryModal from "@/components/ui/modals/ImageGaleryModal";

export default function RoomDetailPage() {
  const { id } = useParams();
  const { selectedRoom, loading, error } = useSelector(
    (state: RootState) => state.rooms
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (id) {
      dispatch(getRoomById(Number(id)));
    }
  }, [id, dispatch]);

  const services = selectedRoom?.services ?? [];
  const images = selectedRoom?.images ?? [];

  const [selectedImage, setSelectedImage] = useState(images[0] || "/placeholder.jpg");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    if (images.length > 0) {
      setSelectedImage(images[0]);
    }
  }, [images]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (loading) return <Spinner />;
  if (error || !selectedRoom)
    return (
      <p className="text-center text-red-500">Error cargando habitación</p>
    );

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 bg-dozebg1 rounded-xl shadow-md mt-10">
      {/* Galería */}
      <div className="bg-gray-100 p-5 rounded-xl shadow-inner">
        {/* Imagen principal */}
        <div
          className="relative w-full h-[300px] rounded-xl overflow-hidden shadow-md cursor-pointer"
          onClick={() => openLightbox(images.indexOf(selectedImage))}
        >
          <Image
            src={selectedImage}
            alt={selectedRoom.name}
            fill
            className="object-cover transition-opacity duration-300"
            unoptimized
          />
        </div>

        {/* Miniaturas */}
     {images.length > 1 && (
  <div className="mt-4 flex overflow-x-auto gap-3 pb-2">
    {images.map((img, i) => (
      <button
        key={i}
        onClick={() => {
          setSelectedImage(img);
        }}
        className={`relative w-28 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:opacity-90 ${
          selectedImage === img
            ? "border-dozeblue ring-2 ring-dozeblue"
            : "border-transparent"
        }`}
      >
        <Image
          src={img}
          alt={`Miniatura ${i + 1}`}
          fill
          className="object-cover"
          unoptimized
        />
      </button>
    ))}
  </div>
)}

      </div>

      {/* Info básica */}
      <div className="mt-8 space-y-3">
        <h1 className="text-3xl font-bold text-dozeblue">
          {selectedRoom.name}
        </h1>
        <p className="text-gray-700">{selectedRoom.description}</p>

        <div className="flex items-center gap-2 text-gray-700">
          <Users className="w-5 h-5" />
          <span>
            Capacidad: {selectedRoom.pax} persona
            {selectedRoom.pax > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Servicios */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold text-dozeblue mb-2">Servicios</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {services.length > 0 ? (
            services.map((service, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-gray-700 bg-white rounded-md px-3 py-2 shadow-sm"
              >
                <CheckCircle className="text-green-500 w-4 h-4" />
                {service}
              </li>
            ))
          ) : (
            <li className="text-gray-400">No se especificaron servicios</li>
          )}
        </ul>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <ImageGalleryModal
          images={images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
