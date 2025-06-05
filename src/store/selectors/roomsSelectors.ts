import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store';
import { Room } from '@/types/room';

export const selectRoomsForProperty = (propertyId: number) =>
  createSelector(
    (state: RootState) => state.rooms.roomsByProperty[propertyId],
    (rooms) => rooms ?? []
  );

const emptyArray: Room[] = [];

export const selectFilteredRoomsForProperty = (
  propertyId: number,
  capacity?: number,
  category?: string
) =>
  createSelector(
    (state: RootState) => state.rooms.roomsByProperty[propertyId] || emptyArray,
    (rooms) =>
      rooms.filter((room) => {
        const capacityMatch = capacity ? room.pax >= capacity : true;
        const categoryMatch = category ? room.type === category : true;
        return capacityMatch && categoryMatch;
      })
  );
