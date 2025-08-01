import axios from './axios';

export async function uploadRoomTypeImages(
  roomTypeId: number,
  files: File[]
): Promise<void> {
  for (const file of files) {
    const formData = new FormData();
    formData.append('image', file);

    await axios.post(
      `/properties/my/room-types/${roomTypeId}/images`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      }
    );
  }
}
