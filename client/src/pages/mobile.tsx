import { Box, Button, Link } from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

import NextLink from 'next/link'
import React from "react";

export default function Mobile() {
  const [longUrl, setLongUrl] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const triggerApiRequest = () => {
    // Disable the button to prevent multiple clicks
    setIsButtonDisabled(true);

    // Make a request to the API using Axios
    axios.get("https://easy-openly-skunk.ngrok-free.app/create-offer-sample")
      .then(response => {
        // Extract the long URL from the API response
        const fetchedLongUrl = response.data.longUrl;

        // Update the state with the long URL
        setLongUrl(fetchedLongUrl);

        // Enable the button after successful fetch
        setIsButtonDisabled(false);
      })
      .catch(error => {
        console.error("Error fetching data from the API:", error);

        // Enable the button in case of an error
        setIsButtonDisabled(false);
      })
    }
  
  return(
    <Box>
      <Link as={NextLink}  target="_blank" href={longUrl}> deeplink </Link>
    
        <Button onClick={triggerApiRequest} disabled={isButtonDisabled} > Click</Button>
        </Box>
    )
}
