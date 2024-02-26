import { Fragment } from 'react';

import { getStoreSettings } from '~/client/queries/get-store-settings';
import { ExistingResultType } from '~/client/util';

type Contact = ExistingResultType<typeof getStoreSettings>['contact'];

interface Props {
  contact: Contact;
}

export const ContactInformation = ({ contact }: Props) => {
  if (!contact) {
    return null;
  }

  return (
    <>
      <address className="not-italic">
        {contact.address.split('\n').map((line) => (
          <Fragment key={line}>
            {line}
            <br />
          </Fragment>
        ))}
      </address>
      {contact.phone ? (
        <a href={`tel:${contact.phone}`}>
          <p>{contact.phone}</p>
        </a>
      ) : null}
    </>
  );
};
