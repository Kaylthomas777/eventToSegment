# Event-To-Segment Lambda

The purpose of this lambda is to intake different types of event data, transform it based on business requirements, and send the transformed data to the Segment API.

## Types of events

### Current Events
- Signed Up: This occurs when a user signs up on one of many applicable pages on rooms to go website.
- Updated User Traits: This occurs when a service sends a request payload with the 'trait' property in order to update user traits in segment

### Future State
- Dispatch tracking events
- Webbula Email Hygiene Data

