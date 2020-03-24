export interface InvitationDisplay {
  id?: number;
  photo: Blob;
  from: string;
  message: string;
  team: number;

}

export interface InvitationDto {
  message: string;
  recipients: number[];
  team: number;
}

export interface AnswerInvitation {
  id: number;
  isAccepted: boolean;
}
