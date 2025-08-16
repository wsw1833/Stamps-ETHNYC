import { PinataSDK } from 'pinata';

export const pinata = new PinataSDK({
  pinataJwt: `${process.env.PINATA_JWT}`,
  pinataGateway: `turquoise-perfect-caterpillar-941.mypinata.cloud`,
  pinataGatewayKey: `LUn5zAAf4XotCnPa9SYODfOE3FjQHCpKZepMBWvA3AP87X18diYdPbyoeFgXtV50`,
});
