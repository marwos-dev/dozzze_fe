import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store';

export const selectRoomsForProperty = (propertyId: number) =>
  createSelector(
    (state: RootState) => state.rooms.roomsByProperty[propertyId],
    (rooms) => rooms ?? []
  );
