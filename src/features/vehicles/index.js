// Vehicles feature — public API (docs/02_ARCHITECTURE.md).
//
// Owns the fleet AND standalone vehicle hire end to end: data, rate, form and
// WhatsApp message. Tour booking (features/booking) must not import from here
// — a tour price already includes the vehicle, so there is nothing for it to
// take.
export { vehicles, getVehicle } from './vehicles.data';
export { vehiclesService } from './vehicles.service';
export {
  calculateRental,
  buildRentalMessage,
  rentalWhatsappLink,
  RENTAL_DAY_LIMITS,
  RENTAL_PASSENGER_LIMITS,
} from './vehicleRental';
export { useVehicleRental } from './useVehicleRental';
export { default as VehicleCard } from './VehicleCard';
export { default as VehicleBookingForm } from './VehicleBookingForm';
