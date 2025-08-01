import axios from './axios';

export async function uploadRoomTypeImages(
  roomId: number,
  file: File
): Promise<void> {
  const formData = new FormData();
  formData.append('image', file);
  await axios.post(`/api/room-types/${roomId}/upload-image/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}
