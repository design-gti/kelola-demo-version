/**
 * Employee list for the iProfile "Employee List" landing table.
 * Sourced from TDP's employee dataset (tdp-prototype-fresh/src/app/data/tdpEmployees.csv) —
 * name/email/position/department fields mirror that CSV. Join Date isn't part of the TDP
 * dataset, so it's a stand-in value here until a real HRIS field is wired up.
 */
export interface IProfileEmployee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  level: string;
  joinDate: string; // DD/MM/YYYY
}

export const iprofileEmployees: IProfileEmployee[] = [
  { id: "250202991255", name: "Helmi Wiratran", email: "helmi.wiratran@ias.id", department: "Strategic Business Unit ICT Solution", position: "ICT Commercial General Manager", level: "General Manager", joinDate: "12/02/2020" },
  { id: "190701005433", name: "Fitriani Simatupang", email: "fitriani.simatupang@ias.id", department: "Risk Management & Governance", position: "Governance Senior Officer", level: "Senior Officer", joinDate: "05/07/2019" },
  { id: "241001011402", name: "Harival Tivani", email: "harival.tivani@ias.id", department: "Strategic Business Unit ICT Solution", position: "Digital Solution Operation Senior Officer", level: "Senior Officer", joinDate: "01/10/2024" },
  { id: "190401005179", name: "Muhammad Firdaus", email: "m.firdaus@ias.id", department: "Risk Management & Governance", position: "Risk Management Senior Officer", level: "Senior Officer", joinDate: "10/04/2019" },
  { id: "241001011421", name: "Muhammad Farhan Alghifary", email: "muhammad.alghifary@ias.id", department: "Human Capital Business Solution", position: "Regional II HC Business Solution Senior Officer", level: "Senior Officer", joinDate: "01/10/2024" },
  { id: "200901007440", name: "Maulana Arif H", email: "maulana.h@ias.id", department: "Strategic Business Unit ICT Solution", position: "Telco & Connectivity Operation Senior Officer", level: "Senior Officer", joinDate: "14/09/2020" },
  { id: "241001009833", name: "Muhammad Syaiful Moechtar", email: "muhammad.syaiful@ias.id", department: "Manpower & Facility Services Commercial", position: "Facility Services Commercial Analyst", level: "Analyst", joinDate: "01/10/2024" },
  { id: "241001011401", name: "Raden Lugina Ludiraprawira Utama", email: "lugina.utama@ias.id", department: "Equipment & Technology Commercial", position: "Technology Commercial Senior Officer", level: "Senior Officer", joinDate: "01/10/2024" },
  { id: "241001009825", name: "Madhari", email: "madhari@ias.id", department: "Regional II", position: "Terminal 2 Specialist Cabang CGK", level: "Division Head", joinDate: "01/10/2024" },
  { id: "200701007420", name: "Ariyanto", email: "ariyanto@ias.id", department: "Regional II", position: "Terminal 3 Specialist Cabang CGK", level: "Division Head", joinDate: "14/07/2020" },
  { id: "241002007660", name: "Liyah Syari Khalifah", email: "liyah.khalifah@ias.id", department: "Regional I", position: "Business Support Senior Officer Cabang BKS & TKG", level: "Senior Officer", joinDate: "02/10/2024" },
  { id: "241002009821", name: "Silvia Anggiawati Muharam", email: "silvia.muharam@ias.id", department: "Regional II", position: "Business Support Senior Officer Cabang KJT BDO PWL", level: "Senior Officer", joinDate: "02/10/2024" },
  { id: "221102009074", name: "Agung Apriandias", email: "agung.apriandias@ias.id", department: "Regional III", position: "Operation & QC Officer KDI & MWS", level: "Officer", joinDate: "02/11/2022" },
  { id: "200501007025", name: "Mhd Alvin Sinaga", email: "alvin.sinaga@ias.id", department: "Regional II", position: "Business Support Officer Cabang BTJ", level: "Officer", joinDate: "07/05/2020" },
  { id: "50201000011", name: "Asep Moh Nurholis", email: "asep.nurholis@ias.id", department: "Regional II", position: "Operation & QC Unit Head HLP", level: "Senior Officer", joinDate: "01/02/2005" },
  { id: "161201001771", name: "Doras Hamonangan Saragih", email: "doras.saragih@ias.id", department: "Regional I", position: "Operation & QC Officer KNO & DTB", level: "Officer", joinDate: "01/12/2016" },
  { id: "241002006397", name: "Mirza", email: "mirza@ias.id", department: "Regional I", position: "Financial Support Officer Cabang KNO & DTB", level: "Officer", joinDate: "02/10/2024" },
  { id: "210504000029", name: "Andy Ihza Mahendra", email: "andy.mahendra@ias.id", department: "Manpower & Facility Services Operation", position: "Manpower & Facility Services Operation Group Head", level: "Group Head", joinDate: "04/05/2021" },
  { id: "241204011408", name: "Inna Katharina Hakim", email: "inna.hakim@ias.id", department: "Legal", position: "Corporate Secretary Group Head", level: "Group Head", joinDate: "04/12/2024" },
  { id: "250302993168", name: "Adi Mandala Suminterdja", email: "adimandala.suminterdja@ias.id", department: "Human Capital Management", position: "Human Capital Management Group Head", level: "Group Head", joinDate: "02/03/2025" },
  { id: "80101000019", name: "Vivy Adianty", email: "vivie@ias.id", department: "Strategic Business Unit ICT Solution", position: "Telco & Connectivity Commercial Division Head", level: "Division Head", joinDate: "01/01/2008" },
  { id: "241001011422", name: "Ignatius Averyan Aji", email: "ignatius.aji@ias.id", department: "Manpower & Facility Services Commercial", position: "Manpower Services Commercial Division Head", level: "Division Head", joinDate: "01/10/2024" },
];
