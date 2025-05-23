import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchRoomById,
  getRooms as apiGetRooms,
} from "@/services/propertiesApi";
import { Room } from "@/types/room";
import { RootState } from "../store"; // Asegúrate que este sea el path correcto

interface RoomsState {
  roomsByProperty: Record<number, Room[]>; // Record[propertyId, Room[]]
  selectedRoom: Room | null;
  loading: boolean;
  error: string | null;
}

interface GetRoomsRequest {
  zoneId?: number;
  propertyId?: number;
}

interface FetchRoomsResponse {
  zoneId?: number;
  propertyId: number;
  rooms: Room[];
}

const initialState: RoomsState = {
  roomsByProperty: {},
  selectedRoom: null,
  loading: false,
  error: null,
};

// Get single room by ID
export const getRoomById = createAsyncThunk<Room, number, { state: RootState }>(
  "rooms/getById",
  async (id, thunkAPI) => {
    const state = thunkAPI.getState();
    const allRooms = Object.values(state.rooms.roomsByProperty).flat();
    const foundRoom = allRooms.find((room) => room.id === id);

    if (foundRoom) {
      return foundRoom;
    }

    return await fetchRoomById(Number(id));
  }
);

// Get rooms for a specific property (optionally filtered by zone)
export const fetchRooms = createAsyncThunk<
  FetchRoomsResponse,
  GetRoomsRequest,
  { state: RootState; rejectValue: string }
>("rooms/fetchByProperty", async ({ zoneId, propertyId }, thunkAPI) => {
  if (!propertyId) {
    return thunkAPI.rejectWithValue("propertyId es requerido");
  }

  const state = thunkAPI.getState();
  const roomsExist = state.rooms.roomsByProperty[propertyId];

  if (roomsExist) {
    return {
      zoneId,
      propertyId,
      rooms: roomsExist,
    };
  }

  try {
    const rooms = await apiGetRooms(Number(zoneId), Number(propertyId));
    return { zoneId, propertyId, rooms };
  } catch (error: unknown) {
    let errorMessage = "Error desconocido";
    if (error instanceof Error) errorMessage = error.message;
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

const roomsSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    clearSelectedRoom(state) {
      state.selectedRoom = null;
    },
    setRoomsForProperty(
      state,
      action: PayloadAction<{ propertyId: number; rooms: Room[] }>
    ) {
      const { propertyId, rooms } = action.payload;
      state.roomsByProperty[propertyId] = rooms;
    },
    clearRoomsForProperty(state, action: PayloadAction<number>) {
      const propertyId = action.payload;
      delete state.roomsByProperty[propertyId];
    },
    setSelectedRoom(state, action: PayloadAction<number>) {
      const roomId = action.payload;
      const allRooms = Object.values(state.roomsByProperty).flat();
      const foundRoom = allRooms.find((room) => room.id === roomId);
      if (foundRoom) {
        state.selectedRoom = foundRoom;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        const { propertyId, rooms } = action.payload;
        state.roomsByProperty[propertyId] = rooms;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error al cargar habitaciones";
      })
      .addCase(getRoomById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRoomById.fulfilled, (state, action) => {
        state.selectedRoom = action.payload;
        state.loading = false;
      })
      .addCase(getRoomById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error al cargar habitación";
      });
  },
});

export const {
  clearSelectedRoom,
  setSelectedRoom,
  setRoomsForProperty,
  clearRoomsForProperty,
} = roomsSlice.actions;

export default roomsSlice.reducer;
