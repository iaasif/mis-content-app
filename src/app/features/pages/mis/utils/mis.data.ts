import { DropdownOption, SelectRadioData } from "../../../../shared/models/models";

export const Hotjobs = [
  {
    id: 1,
    title: 'New Hot Job',
    url: 'new',
    enUrl: '',
    bnUrl: '',
    isnew: false,
  },
  {
    id: 2,
    title: 'Edit Hot Job',
    url: 'edit',
    enUrl: '',
    bnUrl: '',
    isnew: false,
  },
  {
    id: 3,
    title: 'Rearrange Hot Job ( 4 Column) Drag and Drop)   New',
    url: 'rearrange',
    enUrl: '',
    bnUrl: '',
    isnew: true,
  },
  {
    id: 4,
    title: 'Generate Hot Job HTML (4 Column)   ',
    url: '',
    enUrl: 'https://mis.bdjobs.com/mis/hotjobmanager/HJTemplate4col.asp?s=database&id=',
    bnUrl: 'https://mis.bdjobs.com/mis/hotjobmanager/HJTemplateBN4col.asp?s=database&id=',
    isnew: false,
  },
  {
    id: 5,
    title: 'Generate Hot Job Template (DB)   ',
    url: '',
    enUrl: '',
    bnUrl: '',
    isnew: false,
  },
  {
    id: 6,
    title: 'Generate JSON for HOTJOBS',
    url: '',
    enUrl: '',
    bnUrl: '',
    isnew: false,
  },
  {
    id: 7,
    title: 'View Hot Jobs',
    url: 'https://www.bdjobs.com/',
    enUrl: '',
    bnUrl: '',
    isnew: false,
  },
]

export const Tenders = [
  {
    id: 1,
    title: 'New Tender',
    url: 'new',
    enUrl: '',
    bnUrl: '',
    isnew: false,
  },
  {
    id: 2,
    title: 'Edit Tender',
    url: 'https://mis.bdjobs.com/mis/hotjobmanager/TenderList.asp?id=',
    enUrl: '',
    bnUrl: '',
    isnew: false,
  },
  {
    id: 3,
    title: 'Rearrange Tender (Drag and Drop)   New ',
    url: 'https://mis.bdjobs.com/mis/hotjobmanager/arrangetenders_dragNdrop.asp?id=',
    enUrl: '',
    bnUrl: '',
    isnew: true,
  },
  {
    id: 4,
    title: 'Rearrange Tender (3 Column) ',
    url: 'https://mis.bdjobs.com/mis/hotjobmanager/arrangetenders.asp?id=',
    enUrl: '',
    bnUrl: '',
    isnew: true,
  },
  {
    id: 5,
    title: 'Generate Tender HTML (3 Column)   ',
    url: '',
    enUrl: '',
    bnUrl: '',
    isnew: false,
  },
  {
    id: 6,
    title: 'Generate Tender Template (DB) (3 Column)   ',
    url: '',
    enUrl: '',
    bnUrl: '',
    isnew: false,
  },
  {
    id: 7,
    title: 'View Tenders ',
    url: 'https://www.bdjobs.com/',
    enUrl: '',
    bnUrl: '',
    isnew: false,
  },
  {
    id: 8,
    title: 'Hotjobs Data update   New',
    url: '',
    enUrl: '',
    bnUrl: '',
    isnew: true,
  },
  {
    id: 9,
    title: 'Tenders Data update   New',
    url: '',
    enUrl: '',
    bnUrl: '',
    isnew: true,
  },
  {
    id: 10,
    title: 'Training Data update',
    url: '',
    enUrl: '',
    bnUrl: '',
    isnew: false,
  },
]

export const HotJobType: SelectRadioData[] = [
  {
    id: '1',
    label: 'Premium',
    name: 'Premium',
    value: 'Premium'
  },
  {
    id: '2',
    label: 'Normal',
    name: 'Normal',
    value: 'Normal'
  },
]
export const HotJobCategory: SelectRadioData[] = [

  {
    id: '3',
    label: 'Blue Collar',
    name: 'blueCollar',
    value: 'blueCollar'

  },
  {
    id: '4',
    label: 'Complementary',
    name: 'Complementary',
    value: 'Complementary'

  },
  {
    id: '5',
    label: 'Hotjob CM',
    name: 'Hotjob CM',
    value: 'Hotjob CM'

  },

]

export const priorities: DropdownOption[] = [
  { label: 'Low', value: 1 },
  { label: 'Medium', value: 2 },
  { label: 'High', value: 3 },
  { label: 'Urgent', value: 4 },
  { label: 'Critical', value: 5 }
];

export enum UploadFileType {
  html = "html",
  image = "image",
  zip = "zip",
  pdf = "pdf",
}

export const RearrangeData = [
  {
    companytitle: "TechCorp Solutions",
    jobtitle: "Senior Software Engineer",
    postedon: "2024-01-15",
    dbserial: 1001,
    j: {
      id: 2045,
      desc: "Leading development of cloud-native applications using React and Node.js"
    }
  },
  {
    companytitle: "DataVision Inc",
    jobtitle: "Data Scientist",
    postedon: "2024-01-18",
    dbserial: 1002,
    j: {
      id: 2044,
      desc: "Analyze complex datasets and build machine learning models for business insights"
    }
  },
  {
    companytitle: "CreativeMinds Agency",
    jobtitle: "UX/UI Designer",
    postedon: "2024-01-12",
    dbserial: 1003,
    j: {
      id: 2043,
      desc: "Design intuitive user interfaces and improve user experience for mobile apps"
    }
  },
  {
    companytitle: "CloudScale Systems",
    jobtitle: "DevOps Engineer",
    postedon: "2024-01-20",
    dbserial: 1004,
    j: {
      id: 2042,
      desc: "Manage CI/CD pipelines and cloud infrastructure on AWS"
    }
  },
  {
    companytitle: "FinTech Global",
    jobtitle: "Financial Analyst",
    postedon: "2024-01-10",
    dbserial: 1005,
    j: {
      id: 2041,
      desc: "Analyze market trends and prepare financial reports for stakeholders"
    }
  },
  {
    companytitle: "HealthTech Innovations",
    jobtitle: "Product Manager",
    postedon: "2024-01-22",
    dbserial: 1006,
    j: {
      id: 2040,
      desc: "Lead product development for healthcare management software"
    }
  },
  {
    companytitle: "SecureNet Solutions",
    jobtitle: "Cybersecurity Specialist",
    postedon: "2024-01-17",
    dbserial: 1007,
    j: {
      id: 2039,
      desc: "Implement security measures and conduct vulnerability assessments"
    }
  },
  {
    companytitle: "GreenEnergy Corp",
    jobtitle: "Sustainability Consultant",
    postedon: "2024-01-19",
    dbserial: 1008,
    j: {
      id: 2038,
      desc: "Advise on sustainable practices and renewable energy solutions"
    }
  }
];