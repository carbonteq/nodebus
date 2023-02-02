export type DomainMessage = string;

export interface TransportMessage<AdapterMessageType> {
  /**
   * Message ID
   */
  id: string;

  domainMessage: DomainMessage;

  /**
   * raw message as received from the transport
   */
  raw: AdapterMessageType;
}
