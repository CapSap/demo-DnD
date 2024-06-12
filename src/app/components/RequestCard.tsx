import { HydratedDocument } from "mongoose";
import { IStoreRequest } from "../types/types";

export default function RequestCard({
  request,
}: {
  request: HydratedDocument<IStoreRequest>;
}) {
  return <div>hello card{request.name}</div>;
}
