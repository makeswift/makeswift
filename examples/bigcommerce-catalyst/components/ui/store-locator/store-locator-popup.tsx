import Image from "next/image"
import Link from "next/link"

import {
  ValidLocation,
  getFullAddress,
  getLocationUrl,
  getUpcomingHours,
} from "@/lib/airtable/utils"
import { faChevronDown, faClock, faLocationDot, faPhone } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as Accordion from "@radix-ui/react-accordion"
import clsx from "clsx"
import dayjs from "dayjs"

import { Button } from "@/components/Button"

import { Carousel } from "../Carousel"

export function CatalystMapPopup({ location }: { location: ValidLocation }) {
  return (
    <div className="flex max-w-[350px] flex-col font-sans">
      {location.fields["Images"] && location.fields["Images"].length > 0 && (
        <Carousel>
          {location.fields["Images"].map(image => (
            <Image
              key={image.id}
              className="aspect-video w-full object-cover"
              alt={`${location.fields["Name"]} image`}
              src={image.url}
              width={image.width}
              height={image.height}
            />
          ))}
        </Carousel>
      )}
      <div className="p-3">
        <div className="mb-2 font-display text-lg font-bold uppercase text-gray-700 transition-colors hover:text-blue">
          <Link className="focus:outline-none" href={`${getLocationUrl(location)}#info`}>
            {location.fields["Name"]}
          </Link>
        </div>

        {location.fields["Phone"] && (
          <Link
            target="_blank"
            href={`tel:${location.fields["Phone"]}`}
            className="mb-1 flex items-center space-x-2 text-gray-700"
          >
            <FontAwesomeIcon icon={faPhone} className="w-4" />
            <div className="text-sm">{location.fields["Phone"]}</div>
          </Link>
        )}

        {getFullAddress(location) && location.fields["Google Maps URL"] && (
          <Link
            target="_blank"
            href={location.fields["Google Maps URL"]}
            className="mb-1 flex items-center space-x-2 text-gray-700"
          >
            <FontAwesomeIcon icon={faLocationDot} className="w-4 text-white" />
            <div className="text-sm">{getFullAddress(location)}</div>
          </Link>
        )}

        {location.fields["Hours"] && (
          <Accordion.Root type="single" collapsible>
            <Accordion.Item value={location.id} className="mb-1">
              <Accordion.Trigger className="group flex items-center gap-x-2 text-sm text-gray-600 hover:text-gray-700">
                <FontAwesomeIcon icon={faClock} className="w-4" />
                Store hours
                <FontAwesomeIcon
                  icon={faChevronDown}
                  size="xs"
                  className="text-gray-500 transition-transform duration-300 group-data-[state=open]:rotate-180"
                />
              </Accordion.Trigger>
              <Accordion.Content className="pl-6 data-[state=closed]:animate-accordionSlideUp data-[state=open]:animate-accordionSlideDown">
                {getUpcomingHours(location).map(({ day, label, date }) => (
                  <p
                    key={day}
                    className={clsx(
                      "mt-1 text-sm text-gray-900",
                      dayjs(date).isSame(dayjs()) && "font-bold"
                    )}
                  >
                    <span className="inline-block w-[100px] capitalize">{day}</span> {label}
                  </p>
                ))}
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        )}
        <div className="mt-4 flex gap-2">
          <Link href={`${getLocationUrl(location)}/shop`}>
            <Button size="medium">Shop now</Button>
          </Link>
          <Link href={`${getLocationUrl(location)}`}>
            <Button size="medium" variant="outlined">
              View store
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
