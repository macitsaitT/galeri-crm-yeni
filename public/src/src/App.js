import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Car,
  Users,
  Wallet,
  TrendingUp,
  Plus,
  Search,
  MoreVertical,
  FileText,
  CheckCircle,
  AlertCircle,
  Menu,
  X,
  Save,
  Trash2,
  Check,
  CreditCard,
  AlertTriangle,
  Settings,
  LogOut,
  User,
  Loader2,
  Printer,
  Phone,
  Upload,
  Edit,
  ChevronUp,
  ChevronDown,
  Download,
  Key as KeyRound,
  RefreshCw as RotateCcw,
  Camera as ImageIcon,
  Briefcase as Handshake,
  DollarSign as Coins,
  Building as Building2,
  Scroll as Receipt
} from 'lucide-react';

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithCustomToken,
  signInAnonymously,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCrezwwHL3zXWGr99ljLz5N_SEgjLkKoRI",
  authDomain: "galeri-crm-final.firebaseapp.com",
  projectId: "galeri-crm-final",
  storageBucket: "galeri-crm-final.firebasestorage.app",
  messagingSenderId: "432477856580",
  appId: "1:432477856580:web:173afbd46b505de6ef2d11"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const appId = 'galeri-crm-app';

const CAR_DATA = {
  "Mercedes-Benz": ["C 180", "C 200", "C 220", "C 300", "E 180", "E 200", "E 220", "E 300", "A 160", "A 180", "A 200", "A 250", "CLA 180", "CLA 200", "CLA 220", "CLA 250", "S 350", "S 400", "S 500", "Vito", "V-Class", "GLA 180", "GLA 200", "GLA 220", "GLC 200", "GLC 220", "GLC 250", "GLC 300", "GLE 300", "GLE 350", "GLE 450", "GLS 350", "GLS 400", "GLS 450"],
  "BMW": ["116i", "118i", "120i", "218i", "220i", "316i", "318i", "320i", "330i", "420i", "430i", "520i", "530i", "540i", "730i", "740i", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "Z4", "i3", "i4", "iX", "iX3"],
  "Audi": ["A1", "A3", "A4", "A5", "A6", "A7", "A8", "Q2", "Q3", "Q4 e-tron", "Q5", "Q7", "Q8", "TT", "e-tron", "e-tron GT"],
  "Volkswagen": ["Polo", "Golf", "Jetta", "Passat", "Arteon", "T-Cross", "T-Roc", "Tiguan", "Touareg", "Caddy", "Transporter", "Caravelle", "Amarok", "Taigo", "ID.3", "ID.4", "ID.5"],
  "Fiat": ["500", "500X", "500L", "Panda", "Tipo", "Egea", "Doblo", "Fiorino", "Ducato", "Fullback"],
  "Renault": ["Clio", "Megane", "Fluence", "Taliant", "Talisman", "Captur", "Kadjar", "Koleos", "Austral", "Arkana", "Kangoo", "Trafic", "Master", "Zoe"],
  "Toyota": ["Yaris", "Corolla", "Camry", "Avensis", "C-HR", "RAV4", "Highlander", "Land Cruiser", "Hilux", "Proace", "Proace City", "Corolla Cross", "bZ4X"],
  "Ford": ["Fiesta", "Focus", "Mondeo", "Mustang", "EcoSport", "Puma", "Kuga", "Explorer", "Edge", "Ranger", "Transit", "Transit Custom", "Transit Courier", "Tourneo", "Tourneo Custom", "Tourneo Courier"],
  "Honda": ["Jazz", "Civic", "Accord", "City", "HR-V", "CR-V", "e"],
  "Hyundai": ["i10", "i20", "i30", "Elantra", "Tucson", "Santa Fe", "Kona", "Bayon", "Ioniq", "Ioniq 5", "Ioniq 6", "Staria"],
  "Peugeot": ["108", "208", "308", "508", "2008", "3008", "5008", "Rifter", "Traveller", "Partner", "Expert", "Boxer"],
  "Opel": ["Corsa", "Astra", "Insignia", "Mokka", "Crossland", "Grandland", "Combo", "Vivaro", "Movano", "Zafira"],
  "Citroen": ["C1", "C3", "C4", "C5 X", "C5 Aircross", "C-Elysee", "Berlingo", "Spacetourer", "Jumpy", "Jumper"],
  "Skoda": ["Fabia", "Scala", "Octavia", "Superb", "Kamiq", "Karoq", "Kodiaq", "Enyaq"],
  "Nissan": ["Micra", "Note", "Juke", "Qashqai", "X-Trail", "Navara", "Leaf"],
  "Dacia": ["Sandero", "Logan", "Duster", "Jogger", "Spring", "Lodgy", "Dokker"],
  "Kia": ["Picanto", "Rio", "Ceed", "Proceed", "Stinger", "Stonic", "Niro", "Sportage", "Sorento", "EV6", "EV9"],
  "Volvo": ["V40", "V60", "V90", "S60", "S90", "XC40", "XC60", "XC90", "C40", "EX30", "EX90"],
  "Seat": ["Ibiza", "Leon", "Ateca", "Arona", "Tarraco"],
  "Mazda": ["Mazda2", "Mazda3", "Mazda6", "CX-3", "CX-30", "CX-5", "CX-60", "MX-5"],
  "Suzuki": ["Swift", "Baleno", "Vitara", "S-Cross", "Jimny", "Ignis"],
  "Mitsubishi": ["Space Star", "ASX", "Eclipse Cross", "Outlander", "L200"],
  "Jeep": ["Renegade", "Compass", "Cherokee", "Grand Cherokee", "Wrangler", "Gladiator"],
  "Land Rover": ["Defender", "Discovery", "Discovery Sport", "Range Rover Evoque", "Range Rover Velar", "Range Rover Sport", "Range Rover"],
  "Mini": ["Mini 3 Door", "Mini 5 Door", "Mini Clubman", "Mini Countryman", "Mini Cabrio"],
  "Alfa Romeo": ["Giulietta", "Giulia", "Stelvio", "Tonale"],
  "Porsche": ["718", "911", "Panamera", "Macan", "Cayenne", "Taycan"]
};
const VEHICLE_DATA = {
  "Toyota": {
    "Corolla": {
      "1.2 T": ["Dream", "Flame", "Vision", "Standart"],
      "1.3": ["Terra", "Comfort", "Elegant", "Standart"],
      "1.33": ["Life", "Fun", "Elegant", "Standart"],
      "1.4": ["Terra", "Comfort", "Elegant", "Standart"],
      "1.4 D-4D": ["Terra", "Comfort", "Elegant", "Active", "Standart"],
      "1.5": ["Dream", "Flame", "Vision", "Standart"],
      "1.6": ["Terra", "Comfort", "Elegant", "Executive", "Standart"],
      "1.8": ["Dream", "Dream X-Pack", "Flame", "Flame X-Pack", "Passion", "Passion X-Pack", "Vision", "Vision Plus", "Standart"],
      "1.8 Hybrid": ["Dream", "Dream X-Pack", "Flame", "Flame X-Pack", "Passion", "Passion X-Pack", "Vision", "Vision Plus", "Standart"],
      "2.0": ["Dream", "Flame", "Passion", "Standart"],
      "2.0 D-4D": ["Terra", "Comfort", "Elegant", "Executive", "Standart"],
      "2.2 D-4D": ["Elegant", "Executive", "Standart"]
    },
    "Yaris": {
      "1.0": ["Active", "Fun", "Standart"],
      "1.0 VVT-i": ["Active", "Fun", "Cool", "Standart"],
      "1.3": ["Active", "Fun", "Cool", "Sol", "Standart"],
      "1.33": ["Active", "Fun", "Cool", "Sol", "Life", "Standart"],
      "1.4 D-4D": ["Active", "Sol", "Executive", "Standart"],
      "1.5": ["Dream", "Flame", "Vision", "Standart"],
      "1.5 Hybrid": ["Dream", "Flame", "Vision", "Style", "Standart"]
    }
  },
  "Volkswagen": {
    "Passat": {
      "1.4 TSI": ["Trendline", "Comfortline", "Highline", "R-Line", "Standart"],
      "1.5 TSI": ["Business", "Elegance", "R-Line", "Standart"],
      "1.6 TDI": ["Trendline", "Comfortline", "Highline", "Standart"],
      "2.0 TDI": ["Comfortline", "Highline", "R-Line", "Elegance", "Standart"]
    },
    "Golf": {
      "1.0 TSI": ["Trendline", "Comfortline", "Standart"],
      "1.2 TSI": ["Trendline", "Comfortline", "Highline", "Standart"],
      "1.4 TSI": ["Comfortline", "Highline", "R-Line", "Standart"],
      "1.5 TSI": ["Life", "Style", "R-Line", "Standart"],
      "1.6 TDI": ["Trendline", "Comfortline", "Highline", "Standart"],
      "2.0 TDI": ["Comfortline", "Highline", "R-Line", "Standart"]
    }
  },
  "Fiat": {
    "Egea": {
      "1.3 MultiJet": ["Easy", "Urban", "Lounge", "Cross", "Standart"],
      "1.4": ["Easy", "Urban", "Urban Plus", "Lounge", "Standart"],
      "1.4 T-Jet": ["Urban Plus", "Lounge", "Cross Plus", "Standart"],
      "1.5 Hybrid": ["Lounge", "Cross", "Cross Plus", "Standart"],
      "1.6 MultiJet": ["Easy", "Urban", "Lounge", "Cross", "Standart"]
    }
  }
};

const DEFAULT_PROFILE = { galleryName: 'GALERİ ADI', ownerName: 'Admin', phone: '', address: '', password: '1', companyLogo: '' };

const formatCurrency = (amount) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount || 0);
const formatDate = (dateString) => { if (!dateString) return '-'; try { return new Date(dateString).toLocaleDateString('tr-TR'); } catch { return '-'; } };
const formatNumberInput = (value) => { if (value === null || value === undefined || value === '') return ''; const num = String(value).replace(/[^\d]/g, ''); return num ? Number(num).toLocaleString('tr-TR') : ''; };
const parseFormattedNumber = (value) => { if (!value) return 0; return parseInt(String(value).replace(/[^\d]/g, ''), 10) || 0; };
const formatPhoneDisplay = (phone) => { if (!phone) return ''; const digits = phone.replace(/\D/g, ''); if (digits.length === 11 && digits.startsWith('0')) { return `${digits.slice(0,1)}(${digits.slice(1,4)})${digits.slice(4)}`; } return phone; };
const calculateDaysDifference = (startDate) => { if (!startDate) return 0; const start = new Date(startDate); const now = new Date(); const diffTime = Math.abs(now - start); return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); };

const Toast = ({ message, type }) => (message ? <div className={`fixed bottom-5 right-5 z-[100] px-6 py-3 rounded-lg shadow-xl text-white font-bold ${type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>{message}</div> : null);
const StatCard = ({ title, value, icon: Icon, colorClass }) => (<div className={`p-5 rounded-xl ${colorClass} shadow-lg`}><p className="text-xs font-semibold uppercase tracking-wider opacity-80 mb-1">{title}</p><p className="text-3xl font-black">{value}</p>{Icon && <Icon className="absolute top-4 right-4 opacity-30" size={40}/>}</div>);
const SidebarItem = ({ id, icon: Icon, label, activeView, setActiveView }) => (<button onClick={() => setActiveView(id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${activeView === id ? 'bg-yellow-500 text-black' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'}`}><Icon size={18}/> {label}</button>);

const FinanceGroupRow = ({ title, subtext, amount, type, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border rounded-xl overflow-hidden">
            <div className={`p-4 flex justify-between items-center cursor-pointer ${type === 'car' ? 'bg-blue-50' : 'bg-purple-50'}`} onClick={() => setIsOpen(!isOpen)}>
                <div><h4 className="font-bold text-black">{title}</h4><p className="text-xs text-neutral-500">{subtext}</p></div>
                <div className="flex items-center gap-4"><span className={`text-xl font-black ${amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(amount)}</span>{isOpen ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}</div>
            </div>
            {isOpen && <div className="bg-white border-t">{children}</div>}
        </div>
    );
};
const PromoCardModal = ({ isOpen, onClose, inventory, userProfile, showToast }) => {
    const [selectedCar, setSelectedCar] = useState(null);
    const printRef = useRef();
    
    if (!isOpen) return null;
    
    const availableCars = inventory.filter(c => !c.deleted && c.status !== 'Satıldı');
    
    const handlePrint = () => {
        if (!selectedCar) { showToast('Lütfen bir araç seçin', 'error'); return; }
        const printContent = printRef.current;
        if (!printContent) return;
        const printWindow = window.open('', '_blank');
        printWindow.document.write('<html><head><title>Tanıtım Kartı</title>');
        printWindow.document.write('<script src="https://cdn.tailwindcss.com"></script>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(printContent.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.onload = function() { printWindow.print(); };
    };
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
                <div className="px-6 py-4 border-b flex justify-between items-center bg-yellow-50">
                    <h3 className="font-bold text-lg flex items-center gap-2"><FileText size={20}/> Tanıtım Kartı Oluştur</h3>
                    <button onClick={onClose}><X size={20}/></button>
                </div>
                <div className="p-6 space-y-4">
                    <select className="w-full p-3 border rounded-xl" value={selectedCar?.id || ''} onChange={(e) => setSelectedCar(availableCars.find(c => c.id === e.target.value))}>
                        <option value="">-- Araç Seçin --</option>
                        {availableCars.map(car => (<option key={car.id} value={car.id}>{car.brand} {car.model} - {car.plate}</option>))}
                    </select>
                    {selectedCar && (
                        <div ref={printRef} className="border-2 border-dashed border-neutral-300 p-6 rounded-xl bg-white">
                            <div className="text-center mb-4">
                                {userProfile.companyLogo && <img src={userProfile.companyLogo} alt="Logo" className="h-16 mx-auto mb-2"/>}
                                <h2 className="text-2xl font-black">{userProfile.galleryName}</h2>
                                <p className="text-sm text-neutral-500">{userProfile.phone} • {userProfile.address}</p>
                            </div>
                            <hr className="my-4"/>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><span className="font-bold">Marka/Model:</span> {selectedCar.brand} {selectedCar.model}</div>
                                <div><span className="font-bold">Yıl:</span> {selectedCar.year}</div>
                                <div><span className="font-bold">KM:</span> {formatNumberInput(selectedCar.km)}</div>
                                <div><span className="font-bold">Yakıt:</span> {selectedCar.fuelType}</div>
                                <div><span className="font-bold">Vites:</span> {selectedCar.gear}</div>
                                <div><span className="font-bold">Plaka:</span> {selectedCar.plate?.toUpperCase()}</div>
                            </div>
                            <div className="mt-6 text-center"><p className="text-3xl font-black text-green-600">{formatCurrency(selectedCar.salePrice)}</p></div>
                        </div>
                    )}
                    <button onClick={handlePrint} className="w-full bg-yellow-500 text-black font-bold py-3 rounded-xl hover:bg-yellow-600 flex items-center justify-center gap-2"><Printer size={18}/> Yazdır / PDF</button>
                </div>
            </div>
        </div>
    );
};

const SaleModal = ({ isOpen, onClose, onConfirm, price, setPrice, employeeShare, setEmployeeShare, car, customers, selectedCustomerId, setSelectedCustomerId }) => {
  if (!isOpen) return null;
  const isConsignment = car?.ownership === 'consignment';
  const salePrice = parseFormattedNumber(price) || 0;
  const ownerAmount = car?.purchasePrice || 0;
  const employeeAmount = parseFormattedNumber(employeeShare) || 0;
  const galleryProfit = isConsignment ? (salePrice - ownerAmount - employeeAmount) : (salePrice - (car?.purchasePrice || 0) - employeeAmount);
  const activeCustomers = customers?.filter(c => !c.deleted) || [];
  
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-neutral-100">
        <div className="px-6 py-4 border-b border-neutral-100 bg-green-50 flex justify-between items-center"><h3 className="font-bold text-lg text-green-800 flex items-center gap-2"><CheckCircle size={20}/> Satışı Tamamla</h3><button onClick={onClose}><X size={20}/></button></div>
        <form onSubmit={onConfirm} className="p-6 space-y-4">
            <div>
                <label className="block text-sm font-bold text-neutral-700 mb-1">Alıcı Müşteri</label>
                <select className="w-full px-4 py-3 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-0 outline-none text-sm font-medium" value={selectedCustomerId} onChange={(e) => setSelectedCustomerId(e.target.value)}>
                    <option value="">-- Müşteri Seç (Opsiyonel) --</option>
                    {activeCustomers.map(c => (<option key={c.id} value={c.id}>{c.name} {c.phone ? `(${c.phone})` : ''}</option>))}
                </select>
                <p className="text-xs text-neutral-400 mt-1">Aracı satın alan müşteriyi seçin</p>
            </div>
            <div>
                <label className="block text-sm font-bold text-neutral-700 mb-1">Gerçekleşen Satış Fiyatı (TL)</label>
                <input autoFocus type="text" inputMode='numeric' className="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:border-green-500 focus:ring-0 outline-none text-xl font-bold text-green-700" value={price} onChange={(e) => setPrice(formatNumberInput(e.target.value))}/>
            </div>
            <div>
                <label className="block text-sm font-bold text-neutral-700 mb-1">Çalışan Payı (TL)</label>
                <input type="text" inputMode='numeric' className="w-full px-4 py-3 border-2 border-yellow-100 rounded-xl focus:border-yellow-500 focus:ring-0 outline-none text-lg font-bold text-yellow-700" value={employeeShare} onChange={(e) => setEmployeeShare(formatNumberInput(e.target.value))} placeholder="0"/>
                <p className="text-xs text-neutral-400 mt-1">Satışı yapan çalışana verilecek pay</p>
            </div>
            <div className="bg-neutral-50 rounded-xl p-4 space-y-2 border border-neutral-200">
                <div className="flex justify-between text-sm"><span className="text-neutral-600">Satış Fiyatı:</span><span className="font-bold">{formatCurrency(salePrice)}</span></div>
                {isConsignment && (<div className="flex justify-between text-sm"><span className="text-neutral-600">Araç Sahibine:</span><span className="font-bold text-purple-600">-{formatCurrency(ownerAmount)}</span></div>)}
                {!isConsignment && (<div className="flex justify-between text-sm"><span className="text-neutral-600">Araç Maliyeti:</span><span className="font-bold text-red-600">-{formatCurrency(car?.purchasePrice || 0)}</span></div>)}
                {employeeAmount > 0 && (<div className="flex justify-between text-sm"><span className="text-neutral-600">Çalışan Payı:</span><span className="font-bold text-yellow-600">-{formatCurrency(employeeAmount)}</span></div>)}
                <div className="border-t border-neutral-300 pt-2 flex justify-between"><span className="font-bold text-neutral-700">Kasaya Kalan:</span><span className={`font-bold text-lg ${galleryProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(galleryProfit)}</span></div>
            </div>
            <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition shadow-lg">Satışı Onayla & Kaydet</button>
        </form>
      </div>
    </div>
  );
};

const LoginScreen = ({ onLogin, onReset, error }) => {
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login');
  const [resetCode, setResetCode] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    const success = await onReset(resetCode);
    if (success) { setResetMessage('Şifre başarıyla "admin" olarak sıfırlandı.'); setTimeout(() => { setMode('login'); setResetMessage(''); setResetCode(''); }, 2000); } 
    else { setResetMessage('Hatalı sıfırlama kodu.'); }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-neutral-800 p-8 text-center">
        <div className="w-20 h-20 bg-yellow-500 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg"><Car size={40} className="text-black" /></div>
        <h1 className="text-2xl font-black text-black mb-2">GALERİ CRM</h1>
        <p className="text-neutral-500 mb-8 font-medium">{mode === 'login' ? 'Yönetim Paneli Girişi' : 'Şifre Sıfırlama'}</p>
        {mode === 'login' ? (
            <form onSubmit={(e) => {e.preventDefault(); onLogin(password)}} className="space-y-4">
                <div className="relative"><KeyRound className="absolute left-3 top-3.5 text-neutral-400" size={20} /><input type="password" placeholder="Şifre" className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                <button type="submit" className="w-full bg-yellow-500 text-black font-bold py-3 rounded-xl hover:bg-yellow-600 transition shadow-lg">Giriş Yap</button>
                <div className="pt-2"><button type="button" onClick={() => setMode('reset')} className="text-sm text-neutral-400 hover:text-neutral-800 underline">Şifremi Unuttum</button></div>
            </form>
        ) : (
            <form onSubmit={handleResetSubmit} className="space-y-4">
                <div className="relative"><KeyRound className="absolute left-3 top-3.5 text-neutral-400" size={20} /><input type="text" placeholder="Sıfırlama Kodu (123456)" className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none" value={resetCode} onChange={(e) => setResetCode(e.target.value)} /></div>
                {resetMessage && <p className={`text-sm font-medium ${resetMessage.includes('başarı') ? 'text-green-600' : 'text-red-500'}`}>{resetMessage}</p>}
                <button type="submit" className="w-full bg-black text-white font-bold py-3 rounded-xl hover:bg-neutral-800 transition shadow-lg">Şifreyi Sıfırla</button>
                <div className="pt-2"><button type="button" onClick={() => {setMode('login'); setResetMessage('');}} className="text-sm text-neutral-400 hover:text-neutral-800 underline">Giriş Ekranına Dön</button></div>
            </form>
        )}
      </div>
    </div>
  );
};
                  const SettingsModal = ({ isOpen, onClose, profile, setProfile, onLogout }) => {
  const [formData, setFormData] = useState(profile);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => { if(isOpen) setFormData(profile); }, [isOpen, profile]);
  if (!isOpen) return null;

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setFormData({...formData, companyLogo: reader.result}); };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b flex justify-between items-center"><h3 className="font-bold text-lg flex items-center gap-2"><Settings size={20}/> Ayarlar</h3><button onClick={onClose}><X size={20}/></button></div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-bold mb-1">Şirket Logosu</label>
            <div className="flex items-center gap-4">
              {formData.companyLogo && <img src={formData.companyLogo} alt="Logo" className="h-16 w-16 object-contain border rounded"/>}
              <label className="cursor-pointer bg-neutral-100 hover:bg-neutral-200 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"><Upload size={16}/> Logo Yükle<input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload}/></label>
              {formData.companyLogo && <button onClick={() => setFormData({...formData, companyLogo: ''})} className="text-red-500 text-sm">Kaldır</button>}
            </div>
          </div>
          <div><label className="block text-sm font-bold mb-1">Galeri Adı</label><input type="text" className="w-full p-3 border rounded-xl" value={formData.galleryName} onChange={(e) => setFormData({...formData, galleryName: e.target.value})}/></div>
          <div><label className="block text-sm font-bold mb-1">Yetkili Adı</label><input type="text" className="w-full p-3 border rounded-xl" value={formData.ownerName} onChange={(e) => setFormData({...formData, ownerName: e.target.value})}/></div>
          <div><label className="block text-sm font-bold mb-1">Telefon</label><input type="tel" className="w-full p-3 border rounded-xl" value={formData.phone || ''} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="05XX XXX XX XX"/></div>
          <div><label className="block text-sm font-bold mb-1">Adres</label><textarea className="w-full p-3 border rounded-xl" rows="2" value={formData.address || ''} onChange={(e) => setFormData({...formData, address: e.target.value})}/></div>
          <div><label className="block text-sm font-bold mb-1">Giriş Şifresi</label><div className="relative"><input type={showPassword ? "text" : "password"} className="w-full p-3 border rounded-xl pr-10" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}/><button type="button" className="absolute right-3 top-3 text-neutral-400" onClick={() => setShowPassword(!showPassword)}>{showPassword ? '🙈' : '👁️'}</button></div></div>
          <button onClick={() => {setProfile(formData); onClose();}} className="w-full bg-yellow-500 text-black font-bold py-3 rounded-xl hover:bg-yellow-600 flex items-center justify-center gap-2"><Save size={18}/> Kaydet</button>
          <button onClick={onLogout} className="w-full bg-red-100 text-red-600 font-bold py-3 rounded-xl hover:bg-red-200 flex items-center justify-center gap-2"><LogOut size={18}/> Çıkış Yap</button>
        </div>
      </div>
    </div>
  );
};

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center">
        <AlertTriangle size={48} className="mx-auto text-red-500 mb-4"/>
        <h3 className="text-xl font-bold mb-2">Silmek istediğinize emin misiniz?</h3>
        <p className="text-neutral-500 mb-6">Bu işlem geri alınamaz. Öğe çöp kutusuna taşınacaktır.</p>
        <div className="flex gap-3"><button onClick={onClose} className="flex-1 py-3 rounded-xl border font-bold">İptal</button><button onClick={onConfirm} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold">Sil</button></div>
      </div>
    </div>
  );
};

const ReportModal = ({ isOpen, onClose, transactions, inventory, showToast, userProfile }) => {
    const [reportType, setReportType] = useState('summary');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [selectedCarId, setSelectedCarId] = useState('all');
    const printRef = useRef();
    
    if (!isOpen) return null;
    
    const activeTransactions = transactions.filter(t => !t.deleted);
    const activeInventory = inventory.filter(i => !i.deleted);
    
    let filteredTransactions = activeTransactions;
    if (dateRange.start) filteredTransactions = filteredTransactions.filter(t => t.date >= dateRange.start);
    if (dateRange.end) filteredTransactions = filteredTransactions.filter(t => t.date <= dateRange.end);
    if (selectedCarId !== 'all' && selectedCarId !== 'status_satildi') { filteredTransactions = filteredTransactions.filter(t => t.carId === selectedCarId); }
    
    const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((a, c) => a + c.amount, 0);
    const totalExpense = filteredTransactions.filter(t => t.type === 'expense').reduce((a, c) => a + c.amount, 0);
    
    const getBtnStyle = (type) => `px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1 ${selectedCarId === type ? 'bg-yellow-500 text-black' : 'bg-neutral-100 hover:bg-neutral-200'}`;

    const handlePrint = () => {
        const printContent = printRef.current;
        if (!printContent) return;
        const printWindow = window.open('', '_blank');
        printWindow.document.write('<html><head><title>Rapor</title><script src="https://cdn.tailwindcss.com"></script></head><body class="p-8">');
        printWindow.document.write(printContent.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.onload = function() { printWindow.print(); };
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                <div className="px-6 py-4 border-b flex justify-between items-center bg-neutral-50 shrink-0">
                    <h3 className="font-bold text-lg flex items-center gap-2"><FileText size={20}/> Raporlar</h3>
                    <button onClick={onClose}><X size={20}/></button>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto flex-1">
                    <div className="flex flex-wrap gap-2 items-center p-3 bg-neutral-50 rounded-xl">
                        <input type="date" className="p-2 border rounded-lg text-sm" value={dateRange.start} onChange={(e) => setDateRange({...dateRange, start: e.target.value})}/>
                        <span className="text-neutral-400">-</span>
                        <input type="date" className="p-2 border rounded-lg text-sm" value={dateRange.end} onChange={(e) => setDateRange({...dateRange, end: e.target.value})}/>
                        <div className="border-l pl-2 ml-2 flex flex-wrap gap-2">
                            <button onClick={() => setSelectedCarId('all')} className={getBtnStyle('all')}><FileText size={14}/> Tümü</button>
                            <button onClick={() => setSelectedCarId('status_satildi')} className={getBtnStyle('status_satildi')}><CheckCircle size={14}/> Satılan</button>
                        </div>
                    </div>
                    <div ref={printRef} className="border rounded-xl p-4 space-y-4 bg-white">
                        <div className="text-center border-b pb-4">
                            {userProfile?.companyLogo && <img src={userProfile.companyLogo} alt="Logo" className="h-12 mx-auto mb-2"/>}
                            <h2 className="text-xl font-black">{userProfile?.galleryName || 'GALERİ'}</h2>
                            <p className="text-sm text-neutral-500">
                                {selectedCarId === 'all' ? 'Genel Rapor' : selectedCarId === 'status_satildi' ? 'Satılan Araçlar Raporu' : 'Araç Raporu'}
                                {dateRange.start && ` | ${formatDate(dateRange.start)}`}
                                {dateRange.end && ` - ${formatDate(dateRange.end)}`}
                            </p>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="p-4 bg-green-50 rounded-xl"><p className="text-xs text-green-600 font-bold">TOPLAM GELİR</p><p className="text-2xl font-black text-green-600">{formatCurrency(totalIncome)}</p></div>
                            <div className="p-4 bg-red-50 rounded-xl"><p className="text-xs text-red-600 font-bold">TOPLAM GİDER</p><p className="text-2xl font-black text-red-600">{formatCurrency(totalExpense)}</p></div>
                            <div className={`p-4 rounded-xl ${totalIncome - totalExpense >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}><p className="text-xs font-bold">NET DURUM</p><p className={`text-2xl font-black ${totalIncome - totalExpense >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>{formatCurrency(totalIncome - totalExpense)}</p></div>
                        </div>
                        <table className="w-full text-sm">
                            <thead className="bg-neutral-100"><tr><th className="p-2 text-left">Tarih</th><th className="p-2 text-left">Açıklama</th><th className="p-2 text-right">Tutar</th></tr></thead>
                            <tbody>{filteredTransactions.map(t => (<tr key={t.id} className="border-b"><td className="p-2">{formatDate(t.date)}</td><td className="p-2">{t.description || t.category}</td><td className={`p-2 text-right font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>{t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}</td></tr>))}</tbody>
                        </table>
                    </div>
                    <button onClick={handlePrint} className="w-full bg-yellow-500 text-black font-bold py-3 rounded-xl hover:bg-yellow-600 flex items-center justify-center gap-2"><Printer size={18}/> Yazdır / PDF</button>
                </div>
            </div>
        </div>
    );
};
                  function App() {
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [inventory, setInventory] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [userProfile, setUserProfile] = useState(DEFAULT_PROFILE);
  const [activeView, setActiveView] = useState('dashboard');
  const [toast, setToast] = useState({ message: '', type: '' });
  const [modals, setModals] = useState({ addCar: false, addCustomer: false, addExpense: false, settings: false, report: false, promoCard: false, carDetail: false, customerDetail: false, editCar: false, editCustomer: false });
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [activeCarDetail, setActiveCarDetail] = useState(null);
  const [activeCustomerDetail, setActiveCustomerDetail] = useState(null);
  const [saleModal, setSaleModal] = useState({ isOpen: false, carId: null, price: '', employeeShare: '', customerId: '' });
  const [depositModal, setDepositModal] = useState({ isOpen: false, carId: null, amount: '', description: '' });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, type: '', id: null });
  const [activeExpenseCar, setActiveExpenseCar] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [carForm, setCarForm] = useState({ plate: '', brand: '', model: '', engineType: '', packageType: '', year: new Date().getFullYear(), km: '', fuelType: 'Benzin', gear: 'Otomatik', color: '', purchasePrice: '', salePrice: '', entryDate: new Date().toISOString().split('T')[0], ownership: 'stock', ownerName: '', ownerPhone: '', ownerNote: '' });
  const [customerForm, setCustomerForm] = useState({ name: '', phone: '', email: '', notes: '', interestedVehicleId: '' });
  const [expenseForm, setExpenseForm] = useState({ category: '', description: '', amount: '', date: new Date().toISOString().split('T')[0] });

  const showToast = (message, type = 'success') => { setToast({ message, type }); setTimeout(() => setToast({ message: '', type: '' }), 3000); };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.onload = () => console.log('✅ HTML2PDF loaded');
    document.head.appendChild(script);
    return () => { if(document.head.contains(script)) document.head.removeChild(script); };
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) { setUser(firebaseUser); }
        else { try { await signInAnonymously(auth); } catch (err) { console.error("Firebase Auth Error:", err); } }
        setIsAuthReady(true);
      });
    };
    initAuth();
  }, []);

  useEffect(() => {
    if (!user) return;
    const basePath = `artifacts/${appId}/users/${user.uid}`;
    const unsubProfile = onSnapshot(doc(db, basePath, 'settings', 'profile'), (snap) => { if (snap.exists()) { setUserProfile({ ...DEFAULT_PROFILE, ...snap.data() }); } else { setDoc(doc(db, basePath, 'settings', 'profile'), DEFAULT_PROFILE); } });
    const unsubInventory = onSnapshot(collection(db, basePath, 'inventory'), (snap) => setInventory(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubCustomers = onSnapshot(collection(db, basePath, 'customers'), (snap) => setCustomers(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubTransactions = onSnapshot(collection(db, basePath, 'transactions'), (snap) => setTransactions(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => { unsubProfile(); unsubInventory(); unsubCustomers(); unsubTransactions(); };
  }, [user]);

  const setProfile = async (p) => { if (user) { await setDoc(doc(db, `artifacts/${appId}/users/${user.uid}`, 'settings', 'profile'), p, { merge: true }); setUserProfile(p); } };

  const handleLogin = (password) => { 
    if (password === userProfile.password) { setIsLoggedIn(true); setLoginError(''); localStorage.setItem('galeri_crm_logged_in', 'true'); } 
    else { setLoginError('Hatalı şifre!'); } 
  };
  
  const handleLogout = () => { setIsLoggedIn(false); localStorage.removeItem('galeri_crm_logged_in'); };
  
  const handleResetPassword = async (code) => { if (code === '123456') { await setProfile({ ...userProfile, password: 'admin' }); return true; } return false; };

  useEffect(() => { const saved = localStorage.getItem('galeri_crm_logged_in'); if (saved === 'true') setIsLoggedIn(true); }, []);

  const handleAddCar = async (e) => {
    e.preventDefault();
    if (!user) return;
    const basePath = `artifacts/${appId}/users/${user.uid}`;
    const newCar = { ...carForm, km: parseFormattedNumber(carForm.km), purchasePrice: parseFormattedNumber(carForm.purchasePrice), salePrice: parseFormattedNumber(carForm.salePrice), status: 'Stokta', deleted: false, createdAt: new Date().toISOString() };
    try {
      const docRef = await addDoc(collection(db, basePath, 'inventory'), newCar);
      if (newCar.ownership === 'stock' && newCar.purchasePrice > 0) { await addDoc(collection(db, basePath, 'transactions'), { type: 'expense', category: 'Araç Alımı', description: `Araç Alımı - ${newCar.plate?.toLocaleUpperCase('tr-TR')} ${newCar.brand} ${newCar.model}`, amount: newCar.purchasePrice, date: newCar.entryDate, carId: docRef.id, deleted: false }); }
      showToast('Araç başarıyla eklendi.');
      setModals({ ...modals, addCar: false });
      setCarForm({ plate: '', brand: '', model: '', engineType: '', packageType: '', year: new Date().getFullYear(), km: '', fuelType: 'Benzin', gear: 'Otomatik', color: '', purchasePrice: '', salePrice: '', entryDate: new Date().toISOString().split('T')[0], ownership: 'stock', ownerName: '', ownerPhone: '', ownerNote: '' });
    } catch (err) { console.error(err); showToast('Araç eklenirken hata oluştu.', 'error'); }
  };

  const handleUpdateCar = async (e) => {
    e.preventDefault();
    if (!user || !activeCarDetail) return;
    const basePath = `artifacts/${appId}/users/${user.uid}`;
    const updatedData = { ...carForm, km: parseFormattedNumber(carForm.km), purchasePrice: parseFormattedNumber(carForm.purchasePrice), salePrice: parseFormattedNumber(carForm.salePrice) };
    try { await updateDoc(doc(db, basePath, 'inventory', activeCarDetail.id), updatedData); showToast('Araç güncellendi.'); setModals({ ...modals, editCar: false }); } 
    catch (err) { console.error(err); showToast('Güncelleme hatası.', 'error'); }
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    if (!user) return;
    const basePath = `artifacts/${appId}/users/${user.uid}`;
    const newCustomer = { ...customerForm, deleted: false, createdAt: new Date().toISOString() };
    try { await addDoc(collection(db, basePath, 'customers'), newCustomer); showToast('Müşteri eklendi.'); setModals({ ...modals, addCustomer: false }); setCustomerForm({ name: '', phone: '', email: '', notes: '', interestedVehicleId: '' }); } 
    catch (err) { console.error(err); showToast('Müşteri eklenirken hata.', 'error'); }
  };

  const handleUpdateCustomer = async (e) => {
    e.preventDefault();
    if (!user || !activeCustomerDetail) return;
    const basePath = `artifacts/${appId}/users/${user.uid}`;
    try { await updateDoc(doc(db, basePath, 'customers', activeCustomerDetail.id), customerForm); showToast('Müşteri güncellendi.'); setModals({ ...modals, editCustomer: false }); } 
    catch (err) { console.error(err); showToast('Güncelleme hatası.', 'error'); }
  };

  const handleAddExpense = async (expenseData) => {
    if (!user || !activeExpenseCar) return;
    const basePath = `artifacts/${appId}/users/${user.uid}`;
    const newExpense = { type: 'expense', category: expenseData.category, description: expenseData.description || `${expenseData.category} - ${activeExpenseCar.plate?.toLocaleUpperCase('tr-TR')}`, amount: parseFormattedNumber(expenseData.amount), date: expenseData.date, carId: activeExpenseCar.id, deleted: false };
    try { await addDoc(collection(db, basePath, 'transactions'), newExpense); showToast('Gider eklendi.'); setModals({ ...modals, addExpense: false }); setExpenseForm({ category: '', description: '', amount: '', date: new Date().toISOString().split('T')[0] }); } 
    catch (err) { console.error(err); showToast('Gider eklenirken hata.', 'error'); }
  };

  const handleAddGeneralExpense = async (expenseData) => {
    if (!user) return;
    const basePath = `artifacts/${appId}/users/${user.uid}`;
    const newExpense = { type: 'expense', category: expenseData.category, description: expenseData.description, amount: parseFormattedNumber(expenseData.amount), date: expenseData.date, carId: null, deleted: false };
    try { await addDoc(collection(db, basePath, 'transactions'), newExpense); showToast('Genel gider eklendi.'); } 
    catch (err) { console.error(err); showToast('Hata oluştu.', 'error'); }
  };

  const initiateSale = (car) => {
    setSaleModal({ isOpen: true, carId: car.id, price: formatNumberInput(car.salePrice), employeeShare: '', customerId: '' });
    setActiveMenuId(null);
  };

  const handleConfirmSale = async (e) => {
    e.preventDefault();
    if (!user || !saleModal.carId) return;
    const car = inventory.find(c => c.id === saleModal.carId);
    if (!car) return;
    const finalPrice = parseFormattedNumber(saleModal.price);
    const employeeShareAmount = parseFormattedNumber(saleModal.employeeShare) || 0;
    const basePath = `artifacts/${appId}/users/${user.uid}`;
    const selectedCustomer = customers.find(c => c.id === saleModal.customerId);
    const customerName = selectedCustomer?.name || '';
    const customerId = saleModal.customerId || '';
    try {
      await updateDoc(doc(db, basePath, 'inventory', car.id), { status: 'Satıldı', salePrice: finalPrice, soldDate: new Date().toISOString().split('T')[0], employeeShare: employeeShareAmount, customerId: customerId, customerName: customerName });
      const deposit = car.depositAmount || 0;
      const incomeAmount = finalPrice - deposit;
      await addDoc(collection(db, basePath, 'transactions'), { type: 'income', category: 'Araç Satışı', description: `Satış - ${car.plate?.toLocaleUpperCase('tr-TR')} ${car.brand} ${car.model} ${deposit > 0 ? '(Kalan Tutar)' : ''}`, amount: incomeAmount > 0 ? incomeAmount : 0, date: new Date().toISOString().split('T')[0], carId: car.id, deleted: false });
      if (employeeShareAmount > 0) { await addDoc(collection(db, basePath, 'transactions'), { type: 'expense', category: 'Çalışan Payı', description: `Çalışan Payı - ${car.plate?.toLocaleUpperCase('tr-TR')} ${car.brand} ${car.model}`, amount: employeeShareAmount, date: new Date().toISOString().split('T')[0], carId: car.id, deleted: false }); }
      if (car.ownership === 'consignment' && car.purchasePrice > 0) { await addDoc(collection(db, basePath, 'transactions'), { type: 'expense', category: 'Araç Sahibine Ödeme', description: `Araç Sahibi Ödemesi - ${car.ownerName || 'Konsinye'} - ${car.plate?.toLocaleUpperCase('tr-TR')}`, amount: car.purchasePrice, date: new Date().toISOString().split('T')[0], carId: car.id, deleted: false }); }
      showToast(`Araç satışı ${formatCurrency(finalPrice)} bedelle tamamlandı.`);
      setSaleModal({ isOpen: false, carId: null, price: '', employeeShare: '', customerId: '' });
    } catch (err) { console.error(err); showToast("Satış işlemi kaydedilemedi.", "error"); }
  };

  const handleCancelSale = async (car) => {
    if (!user || !car) return;
    const confirmCancel = window.confirm(`${car.brand} ${car.model} (${car.plate?.toLocaleUpperCase('tr-TR')}) satışını iptal etmek istediğinize emin misiniz?`);
    if (!confirmCancel) return;
    const basePath = `artifacts/${appId}/users/${user.uid}`;
    try {
      await updateDoc(doc(db, basePath, 'inventory', car.id), { status: 'Stokta', soldDate: null, customerId: null, customerName: null, employeeShare: null });
      const saleTransactions = transactions.filter(t => !t.deleted && t.carId === car.id && (t.category === 'Araç Satışı' || t.category === 'Çalışan Payı' || t.category === 'Araç Sahibine Ödeme'));
      for (const trans of saleTransactions) { await updateDoc(doc(db, basePath, 'transactions', trans.id), { deleted: true, deletedAt: new Date().toISOString() }); }
      showToast(`${car.brand} ${car.model} satışı iptal edildi.`);
      setActiveMenuId(null);
    } catch (err) { console.error(err); showToast("Satış iptal edilemedi.", "error"); }
  };

  const handleChangeSalePrice = async (car) => {
    if (!user || !car) return;
    const currentPrice = car.salePrice || 0;
    const newPriceStr = window.prompt(`${car.brand} ${car.model} için yeni satış fiyatını girin:\n\nMevcut Fiyat: ${formatCurrency(currentPrice)}`, currentPrice.toString());
    if (newPriceStr === null) return;
    const newPrice = parseFloat(newPriceStr.replace(/[^\d]/g, '')) || 0;
    if (newPrice <= 0 || newPrice === currentPrice) { showToast("Geçerli bir fiyat girin.", "error"); return; }
    const basePath = `artifacts/${appId}/users/${user.uid}`;
    try {
      await updateDoc(doc(db, basePath, 'inventory', car.id), { salePrice: newPrice });
      const saleTransaction = transactions.find(t => !t.deleted && t.carId === car.id && t.category === 'Araç Satışı');
      if (saleTransaction) { const deposit = car.depositAmount || 0; await updateDoc(doc(db, basePath, 'transactions', saleTransaction.id), { amount: newPrice - deposit > 0 ? newPrice - deposit : 0 }); }
      showToast(`Satış fiyatı ${formatCurrency(newPrice)} olarak güncellendi.`);
      setActiveMenuId(null);
    } catch (err) { console.error(err); showToast("Fiyat güncellenemedi.", "error"); }
  };

  const initiateDeposit = (carId) => { setDepositModal({ isOpen: true, carId: carId, amount: '', description: '' }); setActiveMenuId(null); };

  const handleConfirmDeposit = async (e) => {
    e.preventDefault();
    if (!user || !depositModal.carId) return;
    const car = inventory.find(c => c.id === depositModal.carId);
    if (!car) return;
    const depositAmount = parseFormattedNumber(depositModal.amount);
    const basePath = `artifacts/${appId}/users/${user.uid}`;
    try {
      await updateDoc(doc(db, basePath, 'inventory', car.id), { status: 'Kapora Alındı', depositAmount: depositAmount, depositDescription: depositModal.description });
      await addDoc(collection(db, basePath, 'transactions'), { type: 'income', category: 'Kapora', description: `Kapora - ${car.plate?.toLocaleUpperCase('tr-TR')} ${car.brand} ${car.model} ${depositModal.description ? `(${depositModal.description})` : ''}`, amount: depositAmount, date: new Date().toISOString().split('T')[0], carId: car.id, deleted: false });
      showToast(`${formatCurrency(depositAmount)} kapora alındı.`);
      setDepositModal({ isOpen: false, carId: null, amount: '', description: '' });
    } catch (err) { console.error(err); showToast("Kapora kaydedilemedi.", "error"); }
  };

  const handleDelete = async () => {
    if (!user || !deleteModal.type || !deleteModal.id) return;
    const basePath = `artifacts/${appId}/users/${user.uid}`;
    try {
      if (deleteModal.type === 'car') {
        await updateDoc(doc(db, basePath, 'inventory', deleteModal.id), { deleted: true, deletedAt: new Date().toISOString() });
        const carTransactions = transactions.filter(t => t.carId === deleteModal.id && !t.deleted);
        for (const t of carTransactions) { await updateDoc(doc(db, basePath, 'transactions', t.id), { deleted: true, deletedAt: new Date().toISOString() }); }
        showToast('Araç çöp kutusuna taşındı.');
      } else if (deleteModal.type === 'customer') {
        await updateDoc(doc(db, basePath, 'customers', deleteModal.id), { deleted: true, deletedAt: new Date().toISOString() });
        showToast('Müşteri çöp kutusuna taşındı.');
      } else if (deleteModal.type === 'transaction') {
        await updateDoc(doc(db, basePath, 'transactions', deleteModal.id), { deleted: true, deletedAt: new Date().toISOString() });
        showToast('İşlem silindi.');
      }
      setDeleteModal({ isOpen: false, type: '', id: null });
      setModals({ ...modals, carDetail: false, customerDetail: false });
    } catch (err) { console.error(err); showToast("Silme hatası.", "error"); }
  };

  const handleRestore = async (type, id) => {
    if (!user) return;
    const basePath = `artifacts/${appId}/users/${user.uid}`;
    try {
      if (type === 'car') {
        await updateDoc(doc(db, basePath, 'inventory', id), { deleted: false, deletedAt: null });
        const carTransactions = transactions.filter(t => t.carId === id && t.deleted);
        for (const t of carTransactions) { await updateDoc(doc(db, basePath, 'transactions', t.id), { deleted: false, deletedAt: null }); }
        showToast('Araç geri yüklendi.');
      } else if (type === 'customer') {
        await updateDoc(doc(db, basePath, 'customers', id), { deleted: false, deletedAt: null });
        showToast('Müşteri geri yüklendi.');
      }
    } catch (err) { console.error(err); showToast("Geri yükleme hatası.", "error"); }
  };

  const handlePermanentDelete = async (type, id) => {
    if (!user) return;
    const basePath = `artifacts/${appId}/users/${user.uid}`;
    try {
      if (type === 'car') {
        const carTransactions = transactions.filter(t => t.carId === id);
        for (const t of carTransactions) { await deleteDoc(doc(db, basePath, 'transactions', t.id)); }
        await deleteDoc(doc(db, basePath, 'inventory', id));
        showToast('Araç kalıcı olarak silindi.');
      } else if (type === 'customer') {
        await deleteDoc(doc(db, basePath, 'customers', id));
        showToast('Müşteri kalıcı olarak silindi.');
      }
    } catch (err) { console.error(err); showToast("Kalıcı silme hatası.", "error"); }
  };

  if (!isAuthReady) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-yellow-500" size={48}/></div>;
  if (!isLoggedIn) return <LoginScreen onLogin={handleLogin} onReset={handleResetPassword} error={loginError}/>;

  const activeInventory = inventory.filter(i => !i.deleted);
  const activeCustomers = customers.filter(c => !c.deleted);
  const activeTransactions = transactions.filter(t => !t.deleted);
  const deletedCars = inventory.filter(i => i.deleted);
  const deletedCustomers = customers.filter(c => c.deleted);

  const stockCars = activeInventory.filter(c => c.status !== 'Satıldı');
  const soldCars = activeInventory.filter(c => c.status === 'Satıldı');
  const totalIncome = activeTransactions.filter(t => t.type === 'income').reduce((a, c) => a + c.amount, 0);
  const totalExpense = activeTransactions.filter(t => t.type === 'expense').reduce((a, c) => a + c.amount, 0);

  const filteredInventory = (activeView === 'sold' ? soldCars : stockCars).filter(car => `${car.brand} ${car.model} ${car.plate}`.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredCustomers = activeCustomers.filter(c => `${c.name} ${c.phone}`.toLowerCase().includes(searchTerm.toLowerCase()));
                    return (
    <div className="min-h-screen bg-neutral-100 flex">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-black text-white transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col`}>
        <div className="p-4 border-b border-neutral-800">
          <div className="flex items-center gap-3"><div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center"><Car size={24} className="text-black"/></div><div><h1 className="font-black text-lg">{userProfile.galleryName}</h1><p className="text-xs text-neutral-400">{userProfile.ownerName}</p></div></div>
        </div>
        <div className="p-3 space-y-1">
          <button onClick={() => { setCarForm({ plate: '', brand: '', model: '', engineType: '', packageType: '', year: new Date().getFullYear(), km: '', fuelType: 'Benzin', gear: 'Otomatik', color: '', purchasePrice: '', salePrice: '', entryDate: new Date().toISOString().split('T')[0], ownership: 'stock', ownerName: '', ownerPhone: '', ownerNote: '' }); setModals({...modals, addCar: true}); }} className="w-full bg-yellow-500 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-400"><Plus size={20}/> ARAÇ GİRİŞİ</button>
          <button onClick={() => setModals({...modals, promoCard: true})} className="w-full bg-blue-600 text-white font-bold py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-500 text-sm"><FileText size={16}/> TANITIM KARTI</button>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <SidebarItem id="dashboard" icon={LayoutDashboard} label="Özet" activeView={activeView} setActiveView={setActiveView}/>
          <SidebarItem id="inventory" icon={Car} label="Stok Araçlar" activeView={activeView} setActiveView={setActiveView}/>
          <SidebarItem id="sold" icon={CheckCircle} label="Satılan Araçlar" activeView={activeView} setActiveView={setActiveView}/>
          <SidebarItem id="customers" icon={Users} label="Müşteriler" activeView={activeView} setActiveView={setActiveView}/>
          <SidebarItem id="finance" icon={Wallet} label="Gelir / Gider" activeView={activeView} setActiveView={setActiveView}/>
          <SidebarItem id="trash" icon={Trash2} label="Çöp Kutusu" activeView={activeView} setActiveView={setActiveView}/>
        </nav>
        <div className="p-3 border-t border-neutral-800"><button onClick={() => setModals({...modals, settings: true})} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-white"><Settings size={18}/> Ayarlar</button></div>
      </aside>

      <div className="flex-1 md:ml-64">
        <header className="bg-white shadow-sm sticky top-0 z-30 px-4 md:px-6 py-4 flex items-center justify-between">
          <button className="md:hidden p-2" onClick={() => setSidebarOpen(!sidebarOpen)}><Menu size={24}/></button>
          <div className="relative flex-1 max-w-md mx-4"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18}/><input type="text" placeholder="Ara..." className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/></div>
          <div className="flex items-center gap-2"><button onClick={() => setModals({...modals, report: true})} className="p-2 hover:bg-neutral-100 rounded-lg" title="Raporlar"><FileText size={20}/></button><button onClick={() => setModals({...modals, settings: true})} className="p-2 hover:bg-neutral-100 rounded-lg" title="Ayarlar"><Settings size={20}/></button></div>
        </header>

        <main className="p-4 md:p-6">
          {activeView === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Stok Araç" value={stockCars.length} icon={Car} colorClass="bg-black text-white"/>
                <StatCard title="Satılan" value={soldCars.length} icon={CheckCircle} colorClass="bg-green-500 text-white"/>
                <StatCard title="Müşteri" value={activeCustomers.length} icon={Users} colorClass="bg-blue-500 text-white"/>
                <StatCard title="Net Kasa" value={formatCurrency(totalIncome - totalExpense)} icon={Wallet} colorClass={totalIncome - totalExpense >= 0 ? "bg-yellow-500 text-black" : "bg-red-500 text-white"}/>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-5 shadow-lg"><h3 className="font-bold text-lg mb-4 flex items-center gap-2"><TrendingUp size={20}/> Son Satışlar</h3>{soldCars.length === 0 ? <p className="text-neutral-400 text-center py-8">Henüz satış yok</p> : <div className="space-y-3">{soldCars.slice(0, 5).map(car => (<div key={car.id} className="flex justify-between items-center p-3 bg-neutral-50 rounded-xl"><div><p className="font-bold">{car.brand} {car.model}</p><p className="text-xs text-neutral-500">{car.plate?.toUpperCase()}</p></div><p className="font-bold text-green-600">{formatCurrency(car.salePrice)}</p></div>))}</div>}</div>
                <div className="bg-white rounded-2xl p-5 shadow-lg"><h3 className="font-bold text-lg mb-4 flex items-center gap-2"><AlertCircle size={20}/> Uzun Süredir Stokta</h3>{stockCars.filter(c => calculateDaysDifference(c.entryDate) > 30).length === 0 ? <p className="text-neutral-400 text-center py-8">30 günü aşan araç yok</p> : <div className="space-y-3">{stockCars.filter(c => calculateDaysDifference(c.entryDate) > 30).slice(0, 5).map(car => (<div key={car.id} className="flex justify-between items-center p-3 bg-red-50 rounded-xl"><div><p className="font-bold">{car.brand} {car.model}</p><p className="text-xs text-neutral-500">{car.plate?.toUpperCase()}</p></div><p className="font-bold text-red-600">{calculateDaysDifference(car.entryDate)} gün</p></div>))}</div>}</div>
              </div>
            </div>
          )}

          {(activeView === 'inventory' || activeView === 'sold') && (
            <div className="space-y-4">
              <div className="flex justify-between items-center"><h2 className="text-2xl font-black">{activeView === 'sold' ? 'Satılan Araçlar' : 'Stok Araçlar'}</h2><span className="text-sm text-neutral-500">{filteredInventory.length} araç</span></div>
              {filteredInventory.length === 0 ? <div className="bg-white rounded-2xl p-12 text-center"><Car size={48} className="mx-auto text-neutral-300 mb-4"/><p className="text-neutral-400">{activeView === 'sold' ? 'Henüz satılan araç yok.' : 'Stokta araç bulunmuyor.'}</p></div> : (
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-neutral-50 border-b"><tr><th className="p-4 text-left text-xs font-bold text-neutral-500 uppercase">Araç</th><th className="p-4 text-left text-xs font-bold text-neutral-500 uppercase">Fiyat</th><th className="p-4 text-left text-xs font-bold text-neutral-500 uppercase">Durum</th><th className="p-4 text-left text-xs font-bold text-neutral-500 uppercase">{activeView === 'sold' ? 'Kâr/Zarar' : 'Stok Gün'}</th><th className="p-4 text-left text-xs font-bold text-neutral-500 uppercase">İşlem</th></tr></thead>
                    <tbody>
                      {filteredInventory.map(car => {
                        const carTrans = activeTransactions.filter(t => t.carId === car.id);
                        const totalExpenses = carTrans.filter(t => t.type === 'expense').reduce((a, c) => a + c.amount, 0);
                        const carCost = car.ownership === 'stock' ? (car.purchasePrice || 0) : 0;
                        const profit = (car.salePrice || 0) - carCost - totalExpenses + (car.ownership === 'stock' ? (carTrans.find(t => t.category === 'Araç Alımı')?.amount || 0) : 0);
                        return (
                          <tr key={car.id} className="hover:bg-neutral-50 cursor-pointer border-b" onClick={() => {setActiveCarDetail(car); setModals({...modals, carDetail: true});}}>
                            <td className="p-4"><div className="font-bold">{car.brand} {car.model}</div><div className="text-xs text-neutral-500">{car.year} • {formatNumberInput(car.km)} KM • {car.plate?.toUpperCase()}</div>{car.ownership === 'consignment' && <div className="text-xs text-purple-600 flex items-center gap-1 mt-1"><Handshake size={12}/> Sahibi: {car.ownerName}</div>}{activeView === 'sold' && car.customerName && <div className="text-xs text-blue-600 flex items-center gap-1 mt-1"><User size={12}/> Alıcı: {car.customerName}</div>}{activeView === 'sold' && car.soldDate && <div className="text-xs text-neutral-400 mt-1">Satış: {formatDate(car.soldDate)}</div>}</td>
                            <td className="p-4 font-bold">{formatCurrency(car.salePrice)}</td>
                            <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold ${car.status === 'Satıldı' ? 'bg-green-100 text-green-700' : car.status === 'Kapora Alındı' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>{car.status}</span></td>
                            <td className="p-4">{activeView === 'sold' ? <span className={`font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{profit >= 0 ? '+' : ''}{formatCurrency(profit)}</span> : <span className={`text-xs font-bold ${calculateDaysDifference(car.entryDate) >= 60 ? 'text-red-500' : calculateDaysDifference(car.entryDate) >= 30 ? 'text-yellow-600' : 'text-green-600'}`}>{calculateDaysDifference(car.entryDate)} gün</span>}</td>
                            <td className="p-4">
                              <div className="relative">
                                <button onClick={(e) => {e.stopPropagation(); setActiveMenuId(activeMenuId === car.id ? null : car.id);}} className="p-2 hover:bg-neutral-100 rounded-lg"><MoreVertical size={18}/></button>
                                {activeMenuId === car.id && (
                                  <div className="absolute right-0 top-10 bg-white border rounded-xl shadow-xl z-20 py-2 w-48">
                                    {car.status !== 'Satıldı' && (<><button onClick={() => initiateSale(car)} className="w-full px-4 py-2 text-sm hover:bg-neutral-50 flex items-center text-left"><Check size={14} className="mr-2"/> Satıldı</button><button onClick={() => initiateDeposit(car.id)} className="w-full px-4 py-2 text-sm hover:bg-neutral-50 flex items-center text-left"><CreditCard size={14} className="mr-2"/> Kapora</button><button onClick={() => {setActiveExpenseCar(car); setModals({...modals, addExpense: true}); setActiveMenuId(null);}} className="w-full px-4 py-2 text-sm hover:bg-neutral-50 flex items-center text-left"><Receipt size={14} className="mr-2"/> Gider Ekle</button></>)}
                                    {car.status === 'Satıldı' && (<><button onClick={() => handleChangeSalePrice(car)} className="w-full px-4 py-2 text-sm hover:bg-neutral-50 flex items-center text-left text-blue-600"><Coins size={14} className="mr-2"/> Fiyat Değiştir</button><button onClick={() => handleCancelSale(car)} className="w-full px-4 py-2 text-sm hover:bg-orange-50 flex items-center text-left text-orange-600"><RotateCcw size={14} className="mr-2"/> Satışı İptal Et</button></>)}
                                    <div className="border-t my-1"></div>
                                    <button onClick={() => {setCarForm(car); setActiveCarDetail(car); setModals({...modals, editCar: true}); setActiveMenuId(null);}} className="w-full px-4 py-2 text-sm hover:bg-neutral-50 flex items-center text-left"><Edit size={14} className="mr-2"/> Düzenle</button>
                                    <button onClick={() => {setDeleteModal({isOpen: true, type: 'car', id: car.id}); setActiveMenuId(null);}} className="w-full px-4 py-2 text-sm hover:bg-red-50 flex items-center text-left text-red-600"><Trash2 size={14} className="mr-2"/> Sil</button>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeView === 'customers' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center"><h2 className="text-2xl font-black">Müşteriler</h2><button onClick={() => setModals({...modals, addCustomer: true})} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700"><Plus size={18}/> Müşteri Ekle</button></div>
              {filteredCustomers.length === 0 ? <div className="bg-white rounded-2xl p-12 text-center"><Users size={48} className="mx-auto text-neutral-300 mb-4"/><p className="text-neutral-400">Henüz müşteri eklenmemiş.</p></div> : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCustomers.map(customer => {
                    const interestedCar = activeInventory.find(c => c.id === customer.interestedVehicleId);
                    return (
                      <div key={customer.id} className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition cursor-pointer" onClick={() => {setActiveCustomerDetail(customer); setCustomerForm(customer); setModals({...modals, customerDetail: true});}}>
                        <div className="flex items-start justify-between"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"><User size={24} className="text-blue-600"/></div><div><h3 className="font-bold">{customer.name}</h3><p className="text-sm text-neutral-500 flex items-center gap-1"><Phone size={14}/> {formatPhoneDisplay(customer.phone)}</p></div></div></div>
                        {interestedCar && <div className="mt-3 p-2 bg-yellow-50 rounded-lg text-xs"><span className="font-bold text-yellow-700">İlgili Araç:</span> {interestedCar.brand} {interestedCar.model} - {interestedCar.plate?.toUpperCase()}</div>}
                        {customer.notes && <p className="text-sm text-neutral-400 mt-2 line-clamp-2">{customer.notes}</p>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeView === 'finance' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-2"><h2 className="text-2xl font-black">Gelir / Gider</h2><button onClick={() => {setActiveExpenseCar(null); setModals({...modals, addExpense: true});}} className="bg-red-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-red-700"><Plus size={18}/> Genel Gider Ekle</button></div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-green-500 text-white rounded-2xl p-5"><p className="text-sm opacity-80">Toplam Gelir</p><p className="text-3xl font-black">{formatCurrency(totalIncome)}</p></div>
                <div className="bg-red-500 text-white rounded-2xl p-5"><p className="text-sm opacity-80">Toplam Gider</p><p className="text-3xl font-black">{formatCurrency(totalExpense)}</p></div>
                <div className={`${totalIncome - totalExpense >= 0 ? 'bg-blue-500' : 'bg-orange-500'} text-white rounded-2xl p-5`}><p className="text-sm opacity-80">Net Durum</p><p className="text-3xl font-black">{formatCurrency(totalIncome - totalExpense)}</p></div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-5 space-y-3">
                <h3 className="font-bold text-lg">Son İşlemler</h3>
                {activeTransactions.length === 0 ? <p className="text-neutral-400 text-center py-8">Henüz işlem yok.</p> : activeTransactions.sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 20).map(t => (
                  <div key={t.id} className="flex justify-between items-center p-3 border rounded-xl">
                    <div><p className="font-bold">{t.category}</p><p className="text-xs text-neutral-500">{t.description} • {formatDate(t.date)}</p></div>
                    <div className="flex items-center gap-2"><span className={`font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>{t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}</span><button onClick={() => setDeleteModal({isOpen: true, type: 'transaction', id: t.id})} className="p-1 hover:bg-red-100 rounded text-red-500"><Trash2 size={16}/></button></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeView === 'trash' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black flex items-center gap-2"><Trash2 size={24}/> Çöp Kutusu</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-5 shadow-lg"><h3 className="font-bold mb-4">Silinen Araçlar ({deletedCars.length})</h3>{deletedCars.length === 0 ? <p className="text-neutral-400 text-center py-4">Çöp kutusu boş</p> : deletedCars.map(car => (<div key={car.id} className="flex justify-between items-center p-3 border rounded-xl mb-2"><div><p className="font-bold">{car.brand} {car.model}</p><p className="text-xs text-neutral-500">{car.plate?.toUpperCase()}</p></div><div className="flex gap-2"><button onClick={() => handleRestore('car', car.id)} className="text-green-600 hover:bg-green-50 p-2 rounded"><RotateCcw size={16}/></button><button onClick={() => handlePermanentDelete('car', car.id)} className="text-red-600 hover:bg-red-50 p-2 rounded"><Trash2 size={16}/></button></div></div>))}</div>
                <div className="bg-white rounded-2xl p-5 shadow-lg"><h3 className="font-bold mb-4">Silinen Müşteriler ({deletedCustomers.length})</h3>{deletedCustomers.length === 0 ? <p className="text-neutral-400 text-center py-4">Çöp kutusu boş</p> : deletedCustomers.map(customer => (<div key={customer.id} className="flex justify-between items-center p-3 border rounded-xl mb-2"><div><p className="font-bold">{customer.name}</p><p className="text-xs text-neutral-500">{customer.phone}</p></div><div className="flex gap-2"><button onClick={() => handleRestore('customer', customer.id)} className="text-green-600 hover:bg-green-50 p-2 rounded"><RotateCcw size={16}/></button><button onClick={() => handlePermanentDelete('customer', customer.id)} className="text-red-600 hover:bg-red-50 p-2 rounded"><Trash2 size={16}/></button></div></div>))}</div>
              </div>
            </div>
          )}
        </main>
      </div>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)}/>}

      {/* Modals */}
      {modals.addCar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b flex justify-between items-center shrink-0"><h3 className="font-bold text-lg flex items-center gap-2"><Plus size={20}/> Yeni Araç Ekle</h3><button onClick={() => setModals({...modals, addCar: false})}><X size={20}/></button></div>
            <form onSubmit={handleAddCar} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-bold mb-1">Plaka*</label><input required className="w-full p-3 border rounded-xl uppercase" value={carForm.plate} onChange={(e) => setCarForm({...carForm, plate: e.target.value.toUpperCase()})}/></div>
                <div><label className="block text-sm font-bold mb-1">Model Yılı*</label><input required type="number" className="w-full p-3 border rounded-xl" value={carForm.year} onChange={(e) => setCarForm({...carForm, year: e.target.value})}/></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-bold mb-1">Marka*</label><select required className="w-full p-3 border rounded-xl" value={carForm.brand} onChange={(e) => setCarForm({...carForm, brand: e.target.value, model: '', engineType: '', packageType: ''})}><option value="">Seçin</option>{Object.keys(CAR_DATA).map(brand => <option key={brand} value={brand}>{brand}</option>)}</select></div>
                <div><label className="block text-sm font-bold mb-1">Model*</label><select required className="w-full p-3 border rounded-xl" value={carForm.model} onChange={(e) => setCarForm({...carForm, model: e.target.value, engineType: '', packageType: ''})} disabled={!carForm.brand}><option value="">Seçin</option>{carForm.brand && CAR_DATA[carForm.brand]?.map(model => <option key={model} value={model}>{model}</option>)}</select></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-bold mb-1">Motor</label><select className="w-full p-3 border rounded-xl" value={carForm.engineType} onChange={(e) => setCarForm({...carForm, engineType: e.target.value, packageType: ''})} disabled={!carForm.model}><option value="">Seçin</option>{carForm.brand && carForm.model && VEHICLE_DATA[carForm.brand]?.[carForm.model] && Object.keys(VEHICLE_DATA[carForm.brand][carForm.model]).map(engine => <option key={engine} value={engine}>{engine}</option>)}</select></div>
                <div><label className="block text-sm font-bold mb-1">Paket</label><select className="w-full p-3 border rounded-xl" value={carForm.packageType} onChange={(e) => setCarForm({...carForm, packageType: e.target.value})} disabled={!carForm.engineType}><option value="">Seçin</option>{carForm.brand && carForm.model && carForm.engineType && VEHICLE_DATA[carForm.brand]?.[carForm.model]?.[carForm.engineType]?.map(pkg => <option key={pkg} value={pkg}>{pkg}</option>)}</select></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="block text-sm font-bold mb-1">KM*</label><input required type="text" inputMode="numeric" className="w-full p-3 border rounded-xl" value={formatNumberInput(carForm.km)} onChange={(e) => setCarForm({...carForm, km: e.target.value})}/></div>
                <div><label className="block text-sm font-bold mb-1">Yakıt</label><select className="w-full p-3 border rounded-xl" value={carForm.fuelType} onChange={(e) => setCarForm({...carForm, fuelType: e.target.value})}><option>Benzin</option><option>Dizel</option><option>LPG</option><option>Hibrit</option><option>Elektrik</option></select></div>
                <div><label className="block text-sm font-bold mb-1">Vites</label><select className="w-full p-3 border rounded-xl" value={carForm.gear} onChange={(e) => setCarForm({...carForm, gear: e.target.value})}><option>Otomatik</option><option>Manuel</option><option>Yarı Otomatik</option></select></div>
              </div>
              <div><label className="block text-sm font-bold mb-1">Sahiplik*</label><div className="flex gap-4"><label className="flex items-center gap-2"><input type="radio" name="ownership" value="stock" checked={carForm.ownership === 'stock'} onChange={(e) => setCarForm({...carForm, ownership: e.target.value})}/> Stok (Galerinin)</label><label className="flex items-center gap-2"><input type="radio" name="ownership" value="consignment" checked={carForm.ownership === 'consignment'} onChange={(e) => setCarForm({...carForm, ownership: e.target.value})}/> Konsinye</label></div></div>
              {carForm.ownership === 'consignment' && (<div className="grid grid-cols-2 gap-4 p-4 bg-purple-50 rounded-xl"><div><label className="block text-sm font-bold mb-1">Araç Sahibi Adı*</label><input required className="w-full p-3 border rounded-xl" value={carForm.ownerName} onChange={(e) => setCarForm({...carForm, ownerName: e.target.value})}/></div><div><label className="block text-sm font-bold mb-1">Sahibi Tel</label><input type="tel" className="w-full p-3 border rounded-xl" value={carForm.ownerPhone} onChange={(e) => setCarForm({...carForm, ownerPhone: e.target.value})}/></div></div>)}
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-bold mb-1">{carForm.ownership === 'consignment' ? 'Sahibine Ödenecek*' : 'Alış Fiyatı*'}</label><input required type="text" inputMode="numeric" className="w-full p-3 border rounded-xl" value={formatNumberInput(carForm.purchasePrice)} onChange={(e) => setCarForm({...carForm, purchasePrice: e.target.value})}/></div>
                <div><label className="block text-sm font-bold mb-1">Satış Fiyatı*</label><input required type="text" inputMode="numeric" className="w-full p-3 border rounded-xl" value={formatNumberInput(carForm.salePrice)} onChange={(e) => setCarForm({...carForm, salePrice: e.target.value})}/></div>
              </div>
              <button type="submit" className="w-full bg-yellow-500 text-black font-bold py-3 rounded-xl hover:bg-yellow-600 flex items-center justify-center gap-2"><Save size={18}/> Kaydet</button>
            </form>
          </div>
        </div>
      )}

      {modals.editCar && activeCarDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b flex justify-between items-center shrink-0"><h3 className="font-bold text-lg flex items-center gap-2"><Edit size={20}/> Araç Düzenle</h3><button onClick={() => setModals({...modals, editCar: false})}><X size={20}/></button></div>
            <form onSubmit={handleUpdateCar} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-bold mb-1">Plaka</label><input className="w-full p-3 border rounded-xl uppercase" value={carForm.plate} onChange={(e) => setCarForm({...carForm, plate: e.target.value.toUpperCase()})}/></div><div><label className="block text-sm font-bold mb-1">Yıl</label><input type="number" className="w-full p-3 border rounded-xl" value={carForm.year} onChange={(e) => setCarForm({...carForm, year: e.target.value})}/></div></div>
              <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-bold mb-1">Marka</label><select className="w-full p-3 border rounded-xl" value={carForm.brand} onChange={(e) => setCarForm({...carForm, brand: e.target.value, model: ''})}><option value="">Seçin</option>{Object.keys(CAR_DATA).map(b => <option key={b}>{b}</option>)}</select></div><div><label className="block text-sm font-bold mb-1">Model</label><select className="w-full p-3 border rounded-xl" value={carForm.model} onChange={(e) => setCarForm({...carForm, model: e.target.value})}><option value="">Seçin</option>{carForm.brand && CAR_DATA[carForm.brand]?.map(m => <option key={m}>{m}</option>)}</select></div></div>
              <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-bold mb-1">Alış</label><input type="text" inputMode="numeric" className="w-full p-3 border rounded-xl" value={formatNumberInput(carForm.purchasePrice)} onChange={(e) => setCarForm({...carForm, purchasePrice: e.target.value})}/></div><div><label className="block text-sm font-bold mb-1">Satış</label><input type="text" inputMode="numeric" className="w-full p-3 border rounded-xl" value={formatNumberInput(carForm.salePrice)} onChange={(e) => setCarForm({...carForm, salePrice: e.target.value})}/></div></div>
              <button type="submit" className="w-full bg-yellow-500 text-black font-bold py-3 rounded-xl hover:bg-yellow-600 flex items-center justify-center gap-2"><Save size={18}/> Güncelle</button>
            </form>
          </div>
        </div>
      )}

      {modals.addCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center"><h3 className="font-bold text-lg">Yeni Müşteri</h3><button onClick={() => setModals({...modals, addCustomer: false})}><X size={20}/></button></div>
            <form onSubmit={handleAddCustomer} className="p-6 space-y-4">
              <div><label className="block text-sm font-bold mb-1">Ad Soyad*</label><input required className="w-full p-3 border rounded-xl" value={customerForm.name} onChange={(e) => setCustomerForm({...customerForm, name: e.target.value})}/></div>
              <div><label className="block text-sm font-bold mb-1">Telefon</label><input type="tel" className="w-full p-3 border rounded-xl" placeholder="05XX XXX XX XX" value={customerForm.phone} onChange={(e) => setCustomerForm({...customerForm, phone: e.target.value})}/></div>
              <div><label className="block text-sm font-bold mb-1">İlgilendiği Araç</label><select className="w-full p-3 border rounded-xl" value={customerForm.interestedVehicleId} onChange={(e) => setCustomerForm({...customerForm, interestedVehicleId: e.target.value})}><option value="">Seçin</option>{stockCars.map(car => <option key={car.id} value={car.id}>{car.brand} {car.model} - {car.plate?.toUpperCase()}</option>)}</select></div>
              <div><label className="block text-sm font-bold mb-1">Notlar</label><textarea className="w-full p-3 border rounded-xl" rows="2" value={customerForm.notes} onChange={(e) => setCustomerForm({...customerForm, notes: e.target.value})}/></div>
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700">Kaydet</button>
            </form>
          </div>
        </div>
      )}

      {modals.editCustomer && activeCustomerDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center"><h3 className="font-bold text-lg">Müşteri Düzenle</h3><button onClick={() => setModals({...modals, editCustomer: false})}><X size={20}/></button></div>
            <form onSubmit={handleUpdateCustomer} className="p-6 space-y-4">
              <div><label className="block text-sm font-bold mb-1">Ad Soyad</label><input className="w-full p-3 border rounded-xl" value={customerForm.name} onChange={(e) => setCustomerForm({...customerForm, name: e.target.value})}/></div>
              <div><label className="block text-sm font-bold mb-1">Telefon</label><input type="tel" className="w-full p-3 border rounded-xl" value={customerForm.phone} onChange={(e) => setCustomerForm({...customerForm, phone: e.target.value})}/></div>
              <div><label className="block text-sm font-bold mb-1">İlgilendiği Araç</label><select className="w-full p-3 border rounded-xl" value={customerForm.interestedVehicleId} onChange={(e) => setCustomerForm({...customerForm, interestedVehicleId: e.target.value})}><option value="">Seçin</option>{stockCars.map(car => <option key={car.id} value={car.id}>{car.brand} {car.model} - {car.plate?.toUpperCase()}</option>)}</select></div>
              <div><label className="block text-sm font-bold mb-1">Notlar</label><textarea className="w-full p-3 border rounded-xl" rows="2" value={customerForm.notes} onChange={(e) => setCustomerForm({...customerForm, notes: e.target.value})}/></div>
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700">Güncelle</button>
            </form>
          </div>
        </div>
      )}

      {modals.customerDetail && activeCustomerDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center"><h3 className="font-bold text-lg">{activeCustomerDetail.name}</h3><button onClick={() => setModals({...modals, customerDetail: false})}><X size={20}/></button></div>
            <div className="p-6 space-y-4">
              <p><strong>Telefon:</strong> {formatPhoneDisplay(activeCustomerDetail.phone)}</p>
              <p><strong>Notlar:</strong> {activeCustomerDetail.notes || '-'}</p>
              <div className="flex gap-2">
                <button onClick={() => {setCustomerForm(activeCustomerDetail); setModals({...modals, customerDetail: false, editCustomer: true});}} className="flex-1 bg-yellow-500 text-black font-bold py-2 rounded-xl flex items-center justify-center gap-2"><Edit size={16}/> Düzenle</button>
                <button onClick={() => setDeleteModal({isOpen: true, type: 'customer', id: activeCustomerDetail.id})} className="flex-1 bg-red-100 text-red-600 font-bold py-2 rounded-xl flex items-center justify-center gap-2"><Trash2 size={16}/> Sil</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {modals.carDetail && activeCarDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b flex justify-between items-center shrink-0"><h3 className="font-bold text-lg">{activeCarDetail.brand} {activeCarDetail.model}</h3><button onClick={() => setModals({...modals, carDetail: false})}><X size={20}/></button></div>
            <div className="p-6 space-y-3 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <p><strong>Plaka:</strong> {activeCarDetail.plate?.toUpperCase()}</p><p><strong>Yıl:</strong> {activeCarDetail.year}</p>
                <p><strong>KM:</strong> {formatNumberInput(activeCarDetail.km)}</p><p><strong>Yakıt:</strong> {activeCarDetail.fuelType}</p>
                <p><strong>Vites:</strong> {activeCarDetail.gear}</p><p><strong>Durum:</strong> {activeCarDetail.status}</p>
                <p><strong>Alış:</strong> {formatCurrency(activeCarDetail.purchasePrice)}</p><p><strong>Satış:</strong> {formatCurrency(activeCarDetail.salePrice)}</p>
              </div>
              {activeCarDetail.ownership === 'consignment' && <div className="p-3 bg-purple-50 rounded-xl text-sm"><p className="font-bold text-purple-700">Konsinye Araç</p><p>Sahibi: {activeCarDetail.ownerName} {activeCarDetail.ownerPhone && `(${activeCarDetail.ownerPhone})`}</p></div>}
              <div className="flex gap-2 pt-4">
                <button onClick={() => {setCarForm(activeCarDetail); setModals({...modals, carDetail: false, editCar: true});}} className="flex-1 bg-yellow-500 text-black font-bold py-2 rounded-xl flex items-center justify-center gap-2"><Edit size={16}/> Düzenle</button>
                <button onClick={() => setDeleteModal({isOpen: true, type: 'car', id: activeCarDetail.id})} className="flex-1 bg-red-100 text-red-600 font-bold py-2 rounded-xl flex items-center justify-center gap-2"><Trash2 size={16}/> Sil</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {modals.addExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center"><h3 className="font-bold text-lg">{activeExpenseCar ? `Gider Ekle - ${activeExpenseCar.plate?.toUpperCase()}` : 'Genel Gider Ekle'}</h3><button onClick={() => {setModals({...modals, addExpense: false}); setActiveExpenseCar(null);}}><X size={20}/></button></div>
            <form onSubmit={(e) => {e.preventDefault(); activeExpenseCar ? handleAddExpense(expenseForm) : handleAddGeneralExpense(expenseForm); setExpenseForm({ category: '', description: '', amount: '', date: new Date().toISOString().split('T')[0] });}} className="p-6 space-y-4">
              <div><label className="block text-sm font-bold mb-1">Kategori*</label><select required className="w-full p-3 border rounded-xl" value={expenseForm.category} onChange={(e) => setExpenseForm({...expenseForm, category: e.target.value})}><option value="">Seçin</option>{activeExpenseCar ? <><option>Tamir</option><option>Boya</option><option>Sigorta</option><option>Muayene</option><option>Yıkama</option><option>Diğer</option></> : <><option>Kira</option><option>Fatura</option><option>Maaş</option><option>Vergi</option><option>Reklam</option><option>Diğer</option></>}</select></div>
              <div><label className="block text-sm font-bold mb-1">Açıklama</label><input className="w-full p-3 border rounded-xl" value={expenseForm.description} onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}/></div>
              <div><label className="block text-sm font-bold mb-1">Tutar*</label><input required type="text" inputMode="numeric" className="w-full p-3 border rounded-xl" value={formatNumberInput(expenseForm.amount)} onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}/></div>
              <div><label className="block text-sm font-bold mb-1">Tarih</label><input type="date" className="w-full p-3 border rounded-xl" value={expenseForm.date} onChange={(e) => setExpenseForm({...expenseForm, date: e.target.value})}/></div>
              <button type="submit" className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700">Gider Ekle</button>
            </form>
          </div>
        </div>
      )}

      {depositModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-orange-50"><h3 className="font-bold text-lg text-orange-800">Kapora Al</h3><button onClick={() => setDepositModal({isOpen: false, carId: null, amount: '', description: ''})}><X size={20}/></button></div>
            <form onSubmit={handleConfirmDeposit} className="p-6 space-y-4">
              <div><label className="block text-sm font-bold mb-1">Kapora Tutarı*</label><input required type="text" inputMode="numeric" className="w-full p-3 border rounded-xl text-xl font-bold" value={formatNumberInput(depositModal.amount)} onChange={(e) => setDepositModal({...depositModal, amount: e.target.value})}/></div>
              <div><label className="block text-sm font-bold mb-1">Açıklama</label><input className="w-full p-3 border rounded-xl" placeholder="Müşteri adı vb." value={depositModal.description} onChange={(e) => setDepositModal({...depositModal, description: e.target.value})}/></div>
              <button type="submit" className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600">Kaparo Kaydet</button>
            </form>
          </div>
        </div>
      )}

      <SaleModal isOpen={saleModal.isOpen} onClose={() => setSaleModal({...saleModal, isOpen: false})} onConfirm={handleConfirmSale} price={saleModal.price} setPrice={(v) => setSaleModal({...saleModal, price: v})} employeeShare={saleModal.employeeShare} setEmployeeShare={(v) => setSaleModal({...saleModal, employeeShare: v})} car={inventory.find(c => c.id === saleModal.carId)} customers={customers} selectedCustomerId={saleModal.customerId} setSelectedCustomerId={(v) => setSaleModal({...saleModal, customerId: v})}/>
      <SettingsModal isOpen={modals.settings} onClose={() => setModals({...modals, settings: false})} profile={userProfile} setProfile={setProfile} onLogout={handleLogout}/>
      <DeleteConfirmationModal isOpen={deleteModal.isOpen} onClose={() => setDeleteModal({isOpen: false, type: '', id: null})} onConfirm={handleDelete}/>
      <ReportModal isOpen={modals.report} onClose={() => setModals({...modals, report: false})} transactions={transactions} inventory={inventory} showToast={showToast} userProfile={userProfile}/>
      <PromoCardModal isOpen={modals.promoCard} onClose={() => setModals({...modals, promoCard: false})} inventory={inventory} userProfile={userProfile} showToast={showToast}/>
      <Toast message={toast.message} type={toast.type}/>
    </div>
  );
}

export default App;
