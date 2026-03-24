"use client";

import React from "react";
import useSWR from "swr";
import Image from "next/image";

interface Center {
  _id: string;
  address: string;
  day: string;
  time: string;
  zone: string;
  link?: string;
  contactNumbers: string;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }
  return res.json();
};

const CentersTable: React.FC = () => {
  const { data: centers = [], error, isLoading } = useSWR<Center[]>("/api/auth/centers", fetcher, {
    dedupingInterval: 60000,
    revalidateOnFocus: false,
  });

  if (error) return <div className="text-red-600 text-center mt-4">Failed to load centers.</div>;
  if (isLoading) return <div className="text-center mt-4">Loading centers...</div>;

  return (
    <div className="mx-4 lg:mx-6">
      <h1 className="text-4xl text-[color:var(--ink)] font-semibold text-center mt-5 mb-8">Visit Us</h1>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-lg">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-[color:var(--primary)]">
              <th className="p-2 text-left text-white">Zone</th>
              <th className="p-2 text-left text-white">Address</th>
              <th className="p-2 text-left text-white">Day</th>
              <th className="p-2 text-left text-white">Time</th>
              <th className="p-2 text-left text-white">Contact No.</th>
            </tr>
          </thead>
          <tbody>
            {centers.map((center, index) => (
              <tr key={center._id} className={index % 2 === 0 ? "bg-[color:var(--surface)] text-[color:var(--ink)]" : "bg-[color:var(--surface-2)] text-[color:var(--ink)]"}>
                <td className="p-2 text-left text-[color:var(--ink)] font-semibold">{center.zone}</td>
                <td className="p-2">
                  <span>{center.address}</span>
                  {center.link && (
                    <a
                      href={center.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center ml-2 align-middle"
                      aria-label={`Open map for ${center.zone}`}
                    >
                      <Image
                        src="/hyperlink.svg"
                        alt=""
                        width={16}
                        height={16}
                      />
                    </a>
                  )}
                </td>
                <td className="p-2">{center.day}</td>
                <td className="p-2">{center.time}</td>
                <td className="p-2">{center.contactNumbers}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {centers.map(center => (
          <div key={center._id} className="bg-[color:var(--surface)] rounded-lg shadow-md p-4 border">
            <p className="text-base"><span className="font-semibold">Zone:</span> {center.zone}</p>
            <p className="text-base">
              <span className="font-semibold">Address:</span> {center.address}
              {center.link && (
                <a
                  href={center.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center ml-2 align-middle"
                  aria-label={`Open map for ${center.zone}`}
                >
                  <Image
                    src="/hyperlink.svg"
                    alt=""
                    width={16}
                    height={16}
                  />
                </a>
              )}
            </p>
            <p className="text-base"><span className="font-semibold">Day:</span> {center.day}</p>
            <p className="text-base"><span className="font-semibold">Time:</span> {center.time}</p>
            <p className="text-base"><span className="font-semibold">Contact No.:</span> {center.contactNumbers}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-2xl font-semibold text-[color:var(--ink)] mb-2">Always free</p>
        <p className="text-lg text-[color:var(--muted)]">
          If you want to find centers apart from Telangana state, please find them{" "}
          <a
            href="https://sycenters.org/centers"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[color:var(--primary)] underline "
          >
            here
          </a>
        </p>
      </div>

      <hr className="m-10" />
    </div>
  );
};

const Page: React.FC = () => {
  return (
    <div className="page-container pb-6 lg:px-20 bg-[color:var(--bg)] text-[color:var(--ink)]">
      <CentersTable />
    </div>
  );
};

export default Page;
