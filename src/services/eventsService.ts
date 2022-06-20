import { fetchGraphql } from "../utils/fetchGraphql";

const getEvents = async (limit: Number, offset: Number, onlySigned = true) => {
  const response =
    await fetchGraphql(`query MyQuery { substrate_event(limit: ${limit}, offset: ${offset}, order_by: {blockTimestamp: desc}
        ${onlySigned ? ", where: {extrinsic: {isSigned: {_eq: true}}}" : ""}) {
            id
            section
            method
            extrinsic {
                signer  
                isSigned
            }
        }}`);
  return response.substrate_event;
};

export { getEvents };
