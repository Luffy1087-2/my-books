import { GoogleUserModel } from '@my-books/core';

type UserModelDto = {
  emailAddresses: [{ value: string, metadata: { source: { id: string }, verified: boolean } }]
  names: [{ givenName: string, familyName: string }],
};

export function userDtoToGoogleUserModel(userDto: UserModelDto): GoogleUserModel {
  if (!userDto) throw new TypeError('userDto is not valid');
  const emailDto = userDto.emailAddresses[0];
  if (!emailDto) throw new TypeError('emailAddresses dto is not valid');
  const gId = emailDto.metadata.source.id;
  const email = emailDto.value;
  const isEmailVerified = emailDto.metadata.verified;
  const nameDto = userDto.names[0];
  if (!nameDto) throw new TypeError('nameDto is not valid');
  const givenName = nameDto.givenName;
  const familyName = nameDto.familyName;

  return {
    email,
    email_verified: isEmailVerified,
    family_name: familyName,
    given_name: givenName,
    sub: gId
  };
}