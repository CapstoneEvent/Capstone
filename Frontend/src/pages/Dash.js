// EventDashboard.js

import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { Card, CardContent, Typography } from "@mui/material";
import { ReactComponent as ProfileIcon } from "../icons/profile.svg";
import { ReactComponent as BookingsIcon } from "../icons/bookings.svg";
import { ReactComponent as EarningsIcon } from "../icons/earnings.svg";
import { ReactComponent as EventsIcon } from "../icons/events.svg";

const EventDashboard = () => {
  const [eventData, setEventData] = useState({ events: [] });

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
  }, [])

  return (
    <div className="p-8">
      <Typography variant="h4" className="mb-4 text-center">
        Dashboard
      </Typography>

      {eventData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {eventData.total_profiles > 0 && (
              <Card className="bg-blue-200 text-center font-bold">
                <CardContent>
                  <ProfileIcon className="w-8 h-8 mb-2 mx-auto text-blue-800 !bg-blue-200" />
                  <Typography variant="h6" className="text-blue-800">
                    Total Profiles
                  </Typography>
                  <Typography className="text-blue-800">{eventData.total_profiles}</Typography>
                </CardContent>
              </Card>
            )}

            <Card className="bg-purple-200 text-center font-bold">
              <CardContent>
                <EventsIcon className="w-8 h-8 mb-2 mx-auto text-purple-800 !bg-purple-200" />
                <Typography variant="h6" className="text-purple-800">
                  Total Events
                </Typography>
                <Typography className="text-purple-800">{eventData.total_events}</Typography>
              </CardContent>
            </Card>

            <Card className="bg-green-200 text-center font-bold">
              <CardContent>
                <EarningsIcon className="w-8 h-8 mb-2 mx-auto text-green-800 !bg-green-200" />
                <Typography variant="h6" className="text-green-800">
                  Total Earnings
                </Typography>
                <Typography className="text-green-800">CAD ${eventData.total_earnings}</Typography>
              </CardContent>
            </Card>
          </div>
          <Typography variant="h4" className="mb-4 text-center !mt-6">
            Events
          </Typography>

          <TableContainer component={Paper} className="mt-4">
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Event Name</TableCell>
                  <TableCell align="right">Total Bookings</TableCell>
                  <TableCell align="right">Total Earnings ($)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(eventData.events) && eventData.events.map((event, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {event.name}
                    </TableCell>
                    <TableCell align="right">{event.total_bookings}</TableCell>
                    <TableCell align="right">{event.earnings}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </div>
  );
};

export default EventDashboard;
