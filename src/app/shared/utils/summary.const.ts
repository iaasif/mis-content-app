import { cardData, graphCardData } from "../../features/summary/models/summary.model";


export let SummaryCardData: cardData[] = [
    {
        cardId: 1,
        iconName: 'user-default',
        cardTitle: 'Selected Candidates',
        toolText: 'Total number of candidate(s) have been shortlisted to this step. In other words, the total number of candidate(s) who are currently in this step and also have gone through this step to the next steps.',
        totalCount: 0
    },
    {
        cardId: 2,
        iconName: 'calendar',
        cardTitle: 'Schedules',
        toolText: 'Number of schedules with appointed applicants.',
        totalCount: 0
    },
    {
        cardId: 3,
        iconName: 'invite',
        cardTitle: 'Notified',
        toolText: 'Total number of candidate(s) notified through Notification/Email/SMS in this step.',
        totalCount: 0
    },
    {
        cardId: 4,
        iconName: 'comments',
        cardTitle: 'Comments',
        toolText: 'Total number of comment(s) given to the candidate(s) in this step.',
        totalCount: 0
    },
];

export let SummaryGraphCardData: graphCardData[] = [
    {
        cardId: 1,
        cardTitle: 'Number of Assigned, Not Assigned and Rejected Candidates',
        toolText: 'This pie chart shows the number and percentage of Assigned, Not Assigned and Rejected candidates.'
    },
    {
        cardId: 2,
        cardTitle: 'Number of Notified Candidates',
        toolText: 'The following table displays the number of notified and non-notified candidates along with the medium used to notify them.'
    },
    {
        cardId: 3,
        cardTitle: 'Candidates\' Response',
        toolText: 'This chart shows the responses from candidates to the interview invitations.'
    },
    {
        cardId: 4,
        cardTitle: 'Employer Action',
        toolText: 'The following table displays the number of candidates marked as present and absent according to the interview schedules.'
    }
];

export let LiveUpdateCardData: cardData[] = [];

export let LiveUpdateDetailsCardData: graphCardData[] = [
    {
        cardId: 0,
        cardTitle: 'Score by candidates (%)',
        toolText: 'The number of participants based on their score percentage range.'
    },
    {
        cardId: 1,
        cardTitle: 'Participants based on location',
        toolText: 'Location-wise candidates\' participation in the test.'
    },
    {
        cardId: 2,
        cardTitle: 'Participants Feedback',
        toolText: 'Any submitted feedback regarding the online test.'
    }
];