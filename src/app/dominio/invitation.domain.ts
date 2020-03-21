export interface InvitationDisplay {
  id: number;
  profilePicSender: Blob;
  nicknameSender: string;
  message: string;
}

export interface InvitationDto {
  message: string;
  recipients: number[];
  team: number
}

export interface AnswerInvitation {
  id: number;
  answer: boolean;
}
