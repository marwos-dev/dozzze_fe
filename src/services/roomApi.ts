import axios from './axios';
import type { PropertyService } from '@/types/property';

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

export async function getRoomTypeServices(
  roomTypeId: number
): Promise<PropertyService[]> {
  const res = await axios.get(
    `/properties/my/room-types/${roomTypeId}/services`,
    { withCredentials: true }
  );
  return res.data;
}

export async function addRoomTypeService(
  roomTypeId: number,
  data: { code: string; name: string; description?: string }
): Promise<PropertyService> {
  const res = await axios.post(
    `/properties/my/room-types/${roomTypeId}/services`,
    data,
    { withCredentials: true }
  );
  return res.data;
}

export async function deleteRoomTypeService(
  roomTypeId: number,
  serviceId: number
): Promise<void> {
  await axios.delete(
    `/properties/my/room-types/${roomTypeId}/services/${serviceId}`,
    { withCredentials: true }
  );
}
