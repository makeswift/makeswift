import React, { ReactNode, useEffect, useMemo, useState } from 'react';

import Link from 'next/link';

import { Location, getFullAddress, isValidLocation } from '@/lib/airtable/utils';
import { getLocationUrl, getUpcomingHours } from '@/lib/airtable/utils';
import { fetcher } from '@/lib/fetchers';
import { useGeoLocation, usePermissionStatus } from '@/lib/hooks';
import { exists, formatPhoneNumber, getDistance } from '@/lib/utils';
import { faChevronDown, faClock, faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Accordion from '@radix-ui/react-accordion';
import clsx from 'clsx';
import dayjs from 'dayjs';
import useSWR from 'swr';

import { Button } from '../Button';
import { GoogleMaps } from '../google-maps';
import { CatalystMapPopup } from './CatalystMapPopup';

interface Props {
  className?: string;
  children: ReactNode;
  options?: google.maps.MapOptions; // Don't just expose the options here, let's narrow down the exposure of the controls here
}

export function CatalystMap({ className, children, options }: Props) {
  const { data: locations, isLoading } = useSWR<Location[]>('/api/locations', fetcher);
  const [listOpen, setListOpen] = useState(false);
  const { data: position, loading } = useGeoLocation();
  const markers = useMemo(
    () =>
      locations
        ?.filter(isValidLocation)
        .filter(exists)
        .map((location) => {
          return {
            infoWindowContent: <CatalystMapPopup location={location} />,
            location: {
              title: getFullAddress(location) ?? '',
              position: {
                lat: Number(location.fields['Latitude']),
                lng: Number(location.fields['Longitude']),
              },
            },
          };
        }),
    [locations],
  );
  const status = usePermissionStatus('geolocation');

  const closestLocation = useMemo(
    () =>
      position &&
      locations?.filter(isValidLocation).reduce((closest, location) => {
        const distanceToClosest = getDistance(
          { lat: position.coords.latitude, lng: position.coords.longitude },
          { lat: closest.fields['Latitude'], lng: closest.fields['Longitude'] },
        );

        const distanceToLocation = getDistance(
          { lat: position.coords.latitude, lng: position.coords.longitude },
          { lat: location.fields['Latitude'], lng: location.fields['Longitude'] },
        );

        if (distanceToLocation < distanceToClosest) return location;

        return closest;
      }),
    [locations, position],
  );

  const geoLocatedOptions = useMemo(
    () => ({
      ...options,
      ...(position
        ? {
            center: closestLocation
              ? {
                  lat: closestLocation.fields['Latitude'],
                  lng: closestLocation.fields['Longitude'],
                }
              : {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                },
          }
        : {}),
    }),
    [options, position, closestLocation],
  );

  useEffect(() => {
    if (window.document.body.classList.contains('overscroll-none')) return;

    window.document.body.classList.add('overscroll-none');

    return () => {
      window.document.body.classList.remove('overscroll-none');
    };
  }, []);

  return (
    <div className={clsx(className, 'flex h-screen w-full flex-col bg-black')}>
      <div className="w-full">{children}</div>
      <div className="relative z-0 flex min-h-0 flex-1">
        <Button
          color="white"
          size="medium"
          className={clsx(
            'absolute right-4 top-4 z-20 md:hidden',
            !listOpen && 'hover-[&>button]:!text-blue hover-[&>button]:!bg-white',
          )}
          onClick={() => setListOpen(!listOpen)}
        >
          {listOpen ? 'Close' : 'View list'}
        </Button>
        <Accordion.Root
          type="single"
          collapsible
          className={clsx(
            'border-gray-700 absolute z-10 h-full w-full overflow-auto border-r bg-black/80 backdrop-blur-sm transition-transform sm:w-[400px]',
            listOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          )}
        >
          {locations?.length === 0 && !isLoading && (
            <div className="flex justify-center p-4 text-gray-100">
              There are no locations to display.
            </div>
          )}
          {locations
            ?.filter(isValidLocation)
            .sort((a, b) => {
              if (!position) return 0;

              return (
                getDistance(
                  { lat: position.coords.latitude, lng: position.coords.longitude },
                  { lat: a.fields['Latitude'], lng: a.fields['Longitude'] },
                ) -
                getDistance(
                  { lat: position.coords.latitude, lng: position.coords.longitude },
                  { lat: b.fields['Latitude'], lng: b.fields['Longitude'] },
                )
              );
            })
            .map((location) => {
              return (
                <div
                  key={location.id}
                  className="border-gray-700 flex flex-col border-b px-5 pb-5 pt-4"
                >
                  <h2 className="font-display mb-3 text-lg font-bold uppercase leading-tight text-white">
                    {location.fields['Name']}
                    {location.fields['New'] && (
                      <span className="bg-blue font-display relative -top-0.5 ml-2 rounded-full px-2.5 py-1 text-[10px] uppercase leading-none text-white">
                        New
                      </span>
                    )}
                  </h2>
                  {location.fields['Phone'] && (
                    <Link
                      target="_blank"
                      href={`tel:${location.fields['Phone']}`}
                      className="mb-1 flex items-center gap-x-2 text-sm text-gray-300"
                    >
                      <FontAwesomeIcon icon={faPhone} size="sm" className="w-4 text-white" />
                      {formatPhoneNumber(location.fields['Phone'])}
                    </Link>
                  )}

                  {getFullAddress(location) && location.fields['Google Maps URL'] && (
                    <Link
                      target="_blank"
                      href={location.fields['Google Maps URL']}
                      className="mb-1 flex items-center gap-x-2 text-sm text-gray-300"
                    >
                      <FontAwesomeIcon icon={faLocationDot} className="w-4 text-white" />
                      {getFullAddress(location)}
                    </Link>
                  )}

                  {location.fields['Hours'] && (
                    <Accordion.Item className="mb-1" value={location.id}>
                      <Accordion.Trigger className="group flex items-center gap-x-2 text-sm font-bold text-gray-300 hover:text-white">
                        <FontAwesomeIcon icon={faClock} className="w-4 text-white" />
                        Store hours
                        <FontAwesomeIcon
                          icon={faChevronDown}
                          size="xs"
                          className="text-gray-300 transition-transform duration-300 group-data-[state=open]:rotate-180"
                        />
                      </Accordion.Trigger>
                      <Accordion.Content className="data-[state=closed]:animate-accordionSlideUp data-[state=open]:animate-accordionSlideDown pl-6">
                        {getUpcomingHours(location).map(({ day, label, date }) => (
                          <p
                            key={day}
                            className={clsx(
                              'mt-1 text-sm text-white',
                              dayjs(date).isSame(dayjs()) && 'font-bold',
                            )}
                          >
                            <span className="inline-block w-[100px] capitalize">{day}</span> {label}
                          </p>
                        ))}
                      </Accordion.Content>
                    </Accordion.Item>
                  )}

                  <div className="mt-4 flex gap-2">
                    <Link href={`${getLocationUrl(location)}/shop`} target="_blank">
                      <Button size="medium" color="white">
                        Shop now
                      </Button>
                    </Link>
                    <Link href={`${getLocationUrl(location)}`}>
                      <Button size="medium" color="white" variant="outlined">
                        View store
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
        </Accordion.Root>

        <div className="relative z-0 w-full">
          <GoogleMaps markers={markers} options={geoLocatedOptions} />

          {/* {status?.state === "granted" && loading && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-y-2">
                <svg
                  className="animate-spin text-white/80 stroke-current w-[32px] h-[32px] mr-2"
                  viewBox="0 0 50 50"
                >
                  <circle
                    className="animate-pathSpin"
                    cx="25"
                    cy="25"
                    r="20"
                    fill="none"
                    strokeWidth="5"
                    strokeLinecap="round"
                  ></circle>
                </svg>
                <p className="text-lg text-white">Finding your location</p>
              </div>
            </div>
          )}

          {((status?.state === "granted" && !loading) || status?.state === "denied") && (
            <GoogleMaps markers={markers} options={geoLocatedOptions} />
          )} */}
        </div>
      </div>
    </div>
  );
}
