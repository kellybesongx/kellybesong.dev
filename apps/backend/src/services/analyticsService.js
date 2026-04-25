// // // FILE: analyticsService.js
// // // PURPOSE: Talk directly to Supabase database
// // // NOTE: This file requires @supabase/supabase-js to be installed

// // // We'll add the imports once npm is fixed
// // // For now, this is the structure we'll use

// // async function saveEvent(eventData) {
// //     // This function will save an event to Supabase
// //     console.log('Would save:', eventData);
    
// //     // TODO: Add Supabase code after npm install works
// //     return { success: true, data: { id: 1, ...eventData } };
// // }

// // async function getEvents(options = {}) {
// //     // This function will retrieve events from Supabase
// //     console.log('Would fetch events with options:', options);
    
// //     // TODO: Add Supabase code after npm install works
// //     return { success: true, data: [], count: 0 };
// // }

// // async function getEventSummary() {
// //     // This function will get event statistics
// //     console.log('Would fetch summary');
    
//     // TODO: Add Supabase code after npm install works
// //     return { success: true, data: {}, total: 0 };
// // }

// // module.exports = {
// //     saveEvent,
// //     getEvents,
// //     getEventSummary
// // };

// // FILE: analyticsService.js
// // PURPOSE: Talk directly to Supabase database
// // ANALOGY: The worker who actually writes in the notebook

// // Import Supabase client (now that npm is working!)
// const { createClient } = require('@supabase/supabase-js');

// // Import dotenv to read .env file
// require('dotenv').config();

// // Create ONE connection to Supabase (reuse for all requests)
// // This is like opening one phone line to the database
// const supabase = createClient(
//     process.env.SUPABASE_URL,      // Reads from .env file
//     process.env.SUPABASE_ANON_KEY  // Reads from .env file
// );

// /**
//  * Save an analytics event to the database
//  * @param {Object} eventData - The event to save
//  * @param {string} eventData.eventName - Name of event (e.g., "button_click")
//  * @param {Object} eventData.payload - Additional data about event
//  * @param {string} eventData.sessionId - Unique ID for this visit
//  * @returns {Promise<Object>} - Result with success flag and data or error
//  */


// // async function saveEvent(eventData) {
// //     try {
// //         // IMPORTANT: We do NOT add id or created_at here!
// //         // Supabase will add them automatically because:
// //         // 1. 'id' is SERIAL (auto-increment) in the database
// //         // 2. 'created_at' has DEFAULT NOW() in the database
        
// //         // Insert into Supabase
// //         const { data, error } = await supabase
// //             .from('analytics_events')  // Table name we'll create
// //             .insert([eventData])        // Must be array even for one item
// //             .select();                  // Return the saved row with its new ID
        
// //         // If Supabase returned an error, throw it
// //         if (error) {
// //             throw new Error(error.message);
// //         }
        
// //         // Success! Return the saved data
// //         // Supabase automatically added:
// //         // - id (like 1, 2, 3...)
// //         // - created_at (current timestamp)
// //         return {
// //             success: true,
// //             data: data[0]  // First (and only) item in array
// //         };
        
// //     } catch (error) {
// //         // Log error for debugging
// //         console.error('❌ Failed to save event:', error.message);
        
// //         // Return error so controller knows what happened
// //         return {
// //             success: false,
// //             error: error.message
// //         };
// //     }
// // }

// async function saveEvent(eventData) {

//        console.log('📤 Sending to Supabase:', JSON.stringify(eventData, null, 2));
//     try {
//         // eventData already has snake_case from controller
//         const { data, error } = await supabase
//             .from('analytics_events')
//             .insert([eventData])  // Now matches: event_name, session_id
//             .select();
        
//         if (error) {
//             throw new Error(error.message);
//         }
        
//         return {
//             success: true,
//             data: data[0]
//         };
        
//     } catch (error) {
//         console.error('❌ Failed to save event:', error.message);
//         return {
//             success: false,
//             error: error.message
//         };
//     }
// }

// async function getEvents(options = {}) {
//     const limit = options.limit || 100;
//     const fromDate = options.fromDate || null;
    
//     try {
//         let query = supabase
//             .from('analytics_events')
//             .select('*')
//             .order('created_at', { ascending: false });  // snake_case
        
//         query = query.limit(limit);
        
//         if (fromDate) {
//             query = query.gte('created_at', fromDate);
//         }
        
//         const { data, error } = await query;
        
//         if (error) {
//             throw new Error(error.message);
//         }
        
//         // Convert snake_case to camelCase for frontend
//         const formattedData = data.map(event => ({
//             id: event.id,
//             eventName: event.event_name,      // snake → camel
//             payload: event.payload,
//             sessionId: event.session_id,      // snake → camel
//             createdAt: event.created_at       // snake → camel
//         }));
        
//         return {
//             success: true,
//             data: formattedData,
//             count: formattedData.length
//         };
        
//     } catch (error) {
//         console.error('❌ Failed to fetch events:', error.message);
//         return {
//             success: false,
//             error: error.message,
//             data: []
//         };
//     }
// }

// async function getEventSummary() {
//     try {
//         const thirtyDaysAgo = new Date();
//         thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
//         const { data, error } = await supabase
//             .from('analytics_events')
//             .select('event_name')  // snake_case
//             .gte('created_at', thirtyDaysAgo.toISOString());
        
//         if (error) {
//             throw new Error(error.message);
//         }
        
//         const summary = {};
//         data.forEach(event => {
//             const name = event.event_name;  // snake_case
//             summary[name] = (summary[name] || 0) + 1;
//         });
        
//         return {
//             success: true,
//             data: summary,
//             total: data.length
//         };
        
//     } catch (error) {
//         console.error('❌ Failed to get summary:', error.message);
//         return {
//             success: false,
//             error: error.message
//         };
//     }
// }

// // async function saveEvent(eventData) {
// //     try {
// //         // Remove any fields that don't exist in the database
// //         // The database automatically adds 'created_at' with DEFAULT NOW()
// //         const { createdAt, created_at, ...cleanEventData } = eventData;
        
// //         // Insert into Supabase - only send fields that match database columns
// //         const { data, error } = await supabase
// //             .from('analytics_events')
// //             .insert([cleanEventData])  // eventName, payload, sessionId only
// //             .select();                  // Supabase returns data with auto-generated id and created_at
        
// //         if (error) {
// //             throw new Error(error.message);
// //         }
        
// //         return {
// //             success: true,
// //             data: data[0]
// //         };
        
// //     } catch (error) {
// //         console.error('❌ Failed to save event:', error.message);
// //         return {
// //             success: false,
// //             error: error.message
// //         };
// //     }
// // }

// /**
//  * Get analytics events from database
//  * @param {Object} options - Query options
//  * @param {number} options.limit - Maximum number of events to return
//  * @param {string} options.fromDate - Only events after this date (ISO string)
//  * @returns {Promise<Object>} - Result with success flag and data or error
//  */
// // async function getEvents(options = {}) {
// //     // Set defaults if not provided
// //     const limit = options.limit || 100;
// //     const fromDate = options.fromDate || null;
    
// //     try {
// //         // Start building our query
// //         let query = supabase
// //             .from('analytics_events')
// //             .select('*')  // Get all columns
// //             .order('created_at', { ascending: false });  // Newest first
        
// //         // Add limit if provided
// //         query = query.limit(limit);
        
// //         // Add date filter if provided
// //         if (fromDate) {
// //             query = query.gte('created_at', fromDate);
// //         }
        
// //         // Execute the query
// //         const { data, error } = await query;
        
// //         if (error) {
// //             throw new Error(error.message);
// //         }
        
// //         return {
// //             success: true,
// //             data: data,
// //             count: data.length
// //         };
        
// //     } catch (error) {
// //         console.error('❌ Failed to fetch events:', error.message);
        
// //         return {
// //             success: false,
// //             error: error.message,
// //             data: []  // Empty array on error
// //         };
// //     }
// // }

// /**
//  * Get summary statistics about events
//  * @returns {Promise<Object>} - Summary counts by event type
//  */
// // async function getEventSummary() {
// //     try {
// //         // Get all events from last 30 days
// //         const thirtyDaysAgo = new Date();
// //         thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
// //         const { data, error } = await supabase
// //             .from('analytics_events')
// //             .select('eventname')  // Only need event names
// //             .gte('created_at', thirtyDaysAgo.toISOString());
        
// //         if (error) {
// //             throw new Error(error.message);
// //         }
        
// //         // Count how many times each event happened
// //         const summary = {};
// //         data.forEach(event => {
// //             const name = event.eventname;
// //             summary[name] = (summary[name] || 0) + 1;
// //         });
        
// //         return {
// //             success: true,
// //             data: summary,
// //             total: data.length
// //         };
        
// //     } catch (error) {
// //         console.error('❌ Failed to get summary:', error.message);
// //         return {
// //             success: false,
// //             error: error.message
// //         };
// //     }
// // }

// // Export functions so other files can use them
// module.exports = {
//     saveEvent,
//     getEvents,
//     getEventSummary
// };


// FILE: analyticsService.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

async function saveEvent(eventData) {
    try {
        // eventData already has snake_case from controller
        console.log('📤 Inserting into Supabase:', JSON.stringify(eventData, null, 2));
        
        const { data, error } = await supabase
            .from('analytics_events')
            .insert([eventData])  // event_name, session_id (snake_case)
            .select();
        
        if (error) {
            throw new Error(error.message);
        }
        
        // Data from database has snake_case
        // Convert to camelCase for frontend response
        const formattedData = {
            id: data[0].id,
            eventName: data[0].event_name,    // snake → camel
            payload: data[0].payload,
            sessionId: data[0].session_id,    // snake → camel
            createdAt: data[0].created_at     // snake → camel
        };
        
        return {
            success: true,
            data: formattedData
        };
        
    } catch (error) {
        console.error('❌ Failed to save event:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

async function getEvents(options = {}) {
    const limit = options.limit || 100;
    const fromDate = options.fromDate || null;
    
    try {
        let query = supabase
            .from('analytics_events')
            .select('*')
            .order('created_at', { ascending: false });
        
        query = query.limit(limit);
        
        if (fromDate) {
            query = query.gte('created_at', fromDate);
        }
        
        const { data, error } = await query;
        
        if (error) {
            throw new Error(error.message);
        }
        
        // Convert snake_case to camelCase for frontend
        const formattedData = data.map(event => ({
            id: event.id,
            eventName: event.event_name,      // snake → camel
            payload: event.payload,
            sessionId: event.session_id,      // snake → camel
            createdAt: event.created_at       // snake → camel
        }));
        
        return {
            success: true,
            data: formattedData,
            count: formattedData.length
        };
        
    } catch (error) {
        console.error('❌ Failed to fetch events:', error.message);
        return {
            success: false,
            error: error.message,
            data: []
        };
    }
}

async function getEventSummary() {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const { data, error } = await supabase
            .from('analytics_events')
            .select('event_name')  // snake_case in database
            .gte('created_at', thirtyDaysAgo.toISOString());
        
        if (error) {
            throw new Error(error.message);
        }
        
        // Summary uses event names as keys (camelCase from database values)
        const summary = {};
        data.forEach(event => {
            const name = event.event_name;  // This comes as "page_view" etc.
            summary[name] = (summary[name] || 0) + 1;
        });
        
        return {
            success: true,
            data: summary,
            total: data.length
        };
        
    } catch (error) {
        console.error('❌ Failed to get summary:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

module.exports = {
    saveEvent,
    getEvents,
    getEventSummary
};