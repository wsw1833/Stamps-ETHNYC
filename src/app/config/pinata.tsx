import { PinataSDK } from 'pinata';

export const pinata = new PinataSDK({
  pinataJwt: `${process.env.PINATA_JWT}`,
  pinataGateway: `turquoise-perfect-caterpillar-941.mypinata.cloud`,
});
