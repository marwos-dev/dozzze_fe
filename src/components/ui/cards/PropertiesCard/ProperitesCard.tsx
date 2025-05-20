import { Property } from "@/types/property";
import PropertyCardMedia from "./PropertyCardMedia";
import PropertyCardInfo from "./PropertyCardInfo";
import PropertyActions from "./PropertyCardActions";

export default function PropertiesCard(props: Property) {
  return (
    <div className="bg-dozebg1  max-w-6xl rounded-3xl mx-1 m-2 md:mx-2 shadow-md overflow-hidden p-4 flex flex-col md:flex-row gap-4 min-h-[240px]">
      <PropertyCardMedia images={props.images} coverImage={props.cover_image} />
      <PropertyCardInfo
        name={props.name}
        address={props.address}
        zone={props.zone}
        description={props.description}
      />
      <PropertyActions
        id={props.id}
        communication_methods={props.communication_methods}
        roomsCount={props.rooms?.length || 0}
      />
    </div>
  );
}
