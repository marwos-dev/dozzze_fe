import axios from './axios';

export async function uploadRoomTypeImages(
  roomId: number,
  file: File
): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);
  const res = await axios.post(
    `/properties/my/room-types/${roomId}/images`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );
  return res.data?.image || '';
}
export async function getRoomTypeImages(roomTypeId: number): Promise<string[]> {
  const response = await axios.get(
    `/properties/my/room-types/${roomTypeId}/images`
  );
  return response.data.map((img: { image: string }) => img.image);
}
