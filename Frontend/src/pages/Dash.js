// EventDashboard.js

import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { ReactComponent as ProfileIcon } from "../icons/profile.svg";
import { ReactComponent as BookingsIcon } from "../icons/bookings.svg";
import { ReactComponent as EarningsIcon } from "../icons/earnings.svg";
import { ReactComponent as EventsIcon } from "../icons/events.svg";

const EventDashboard = () => {
  const [eventData, setEventData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/event/dashboard/");
        const data = await response.json();
        setEventData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-8">
      <Typography variant="h4" className="mb-4 text-center">
        Dashboard
      </Typography>

      {eventData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-blue-200 text-center font-bold">
              <CardContent>
                <ProfileIcon className="w-8 h-8 mb-2 mx-auto text-blue-800 !bg-blue-200" />
                <Typography variant="h6" className="text-blue-800">
                  Total Profiles
                </Typography>
                <Typography className="text-blue-800">{eventData.total_profiles}</Typography>
              </CardContent>
            </Card>

            <Card className="bg-purple-200 text-center font-bold">
              <CardContent>
                <EventsIcon className="w-8 h-8 mb-2 mx-auto text-purple-800 !bg-purple-200" />
                <Typography variant="h6" className="text-purple-800">
                  Total Events
                </Typography>
                <Typography className="text-purple-800">{eventData.total_events}</Typography>
                <EarningsIcon className="w-8 h-8 mx-auto my-2 text-purple-800 !bg-purple-200" />
                <Typography className="text-purple-800">Total Earnings: ${eventData.total_earnings}</Typography>
              </CardContent>
            </Card>
          </div>
          <Typography variant="h4" className="mb-4 text-center !mt-6">
            Events
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {eventData.events.map((event, index) => (
              <Card key={index} className={`bg-${index % 2 === 0 ? "green" : "yellow"}-200 text-center font-bold`}>
                <CardContent>
                  <Typography variant="h6" className={`text-${index % 2 === 0 ? "green" : "yellow"}-800`}>
                    {event.name}
                  </Typography>
                  <BookingsIcon
                    className={`w-8 h-8 mx-auto mb-2 text-${index % 2 === 0 ? "green" : "yellow"}-800 !bg-${
                      index % 2 === 0 ? "green" : "yellow"
                    }-200`}
                  />
                  <Typography className={`text-${index % 2 === 0 ? "green" : "yellow"}-800`}>
                    Total Bookings: {event.total_bookings}
                  </Typography>
                  <EarningsIcon
                    className={`w-8 h-8 mx-auto my-2 text-${index % 2 === 0 ? "green" : "yellow"}-800 !bg-${
                      index % 2 === 0 ? "green" : "yellow"
                    }-200`}
                  />
                  <Typography className={`text-${index % 2 === 0 ? "green" : "yellow"}-800`}>
                    Earnings: ${event.earnings}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default EventDashboard;
