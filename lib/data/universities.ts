
export interface University {
    id: string;
    label: string;
    region: 'Bac' | 'Trung' | 'Nam';
    students: number;
    lecturers: number;
    description: string;
}

export const universities: University[] = [
    // === Miền Bắc (Region ID: r_Bac) ===
    { id: 'hust', label: 'Bách Khoa HN', region: 'Bac', students: 350000, lecturers: 2000, description: 'Đại học kỹ thuật hàng đầu Việt Nam' },
    { id: 'vnu_hn', label: 'ĐHQG Hà Nội', region: 'Bac', students: 400000, lecturers: 2500, description: 'Đại học đa ngành, đa lĩnh vực' },
    { id: 'neu', label: 'KTQD', region: 'Bac', students: 45000, lecturers: 1200, description: 'Trường đh đầu ngành về kinh tế' },
    { id: 'ftu', label: 'Ngoại Thương', region: 'Bac', students: 20000, lecturers: 900, description: 'Đào tạo kinh tế đối ngoại xuất sắc' },
    { id: 'hmmu', label: 'Y Hà Nội', region: 'Bac', students: 8000, lecturers: 1000, description: 'Cái nôi đào tạo Y khoa phía Bắc' },
    { id: 'hnue', label: 'Sư Phạm HN', region: 'Bac', students: 25000, lecturers: 110, description: 'Trường sư phạm trọng điểm' },
    { id: 'utc', label: 'Giao Thông', region: 'Bac', students: 22000, lecturers: 100, description: 'Đào tạo ngành giao thông vận tải' },
    { id: 'hau', label: 'Kiến Trúc HN', region: 'Bac', students: 15000, lecturers: 80, description: 'Đào tạo kiến trúc sư, quy hoạch' },
    { id: 'ptit', label: 'Bưu Chính', region: 'Bac', students: 18000, lecturers: 70, description: 'Công nghệ thông tin và truyền thông' },
    { id: 'tlu', label: 'Thủy Lợi', region: 'Bac', students: 16000, lecturers: 50, description: 'Chuyên ngành tài nguyên nước' },

    // === Miền Trung (Region ID: r_Trung) ===
    { id: 'dut', label: 'Bách Khoa ĐN', region: 'Trung', students: 28000, lecturers: 900, description: 'Trường kỹ thuật lớn nhất miền Trung' },
    { id: 'hue_uni', label: 'Đại Học Huế', region: 'Trung', students: 45000, lecturers: 2000, description: 'Đại học vùng trọng điểm quốc gia' },
    { id: 'udn_k', label: 'Kinh Tế ĐN', region: 'Trung', students: 18000, lecturers: 600, description: 'Thành viên ĐH Đà Nẵng' },
    { id: 'udn_sp', label: 'Sư Phạm ĐN', region: 'Trung', students: 12000, lecturers: 500, description: 'Đào tạo giáo viên miền Trung' },
    { id: 'vinh_uni', label: 'Đại Học Vinh', region: 'Trung', students: 30000, lecturers: 1000, description: 'Trường đại học trọng điểm Bắc Trung Bộ' },
    { id: 'qnu', label: 'Quy Nhơn', region: 'Trung', students: 14000, lecturers: 600, description: 'Đại học đa ngành tại Bình Định' },
    { id: 'ntu', label: 'Nha Trang', region: 'Trung', students: 15000, lecturers: 700, description: 'Thế mạnh về thủy hải sản' },
    { id: 'taynguyen', label: 'Tây Nguyên', region: 'Trung', students: 10000, lecturers: 500, description: 'Đào tạo nhân lực cho Tây Nguyên' },
    { id: 'hcm_med_hue', label: 'Y Dược Huế', region: 'Trung', students: 9000, lecturers: 800, description: 'Đào tạo y bác sĩ miền Trung' },
    { id: 'dtu', label: 'Duy Tân', region: 'Trung', students: 25000, lecturers: 1100, description: 'Đại học tư thục lớn tại Đà Nẵng' },

    // === Miền Nam (Region ID: r_Nam) ===
    { id: 'hcmut', label: 'Bách Khoa HCM', region: 'Nam', students: 26000, lecturers: 1200, description: 'Lá cờ đầu kỹ thuật phía Nam' },
    { id: 'vnu_hcm', label: 'ĐHQG TP.HCM', region: 'Nam', students: 60000, lecturers: 3500, description: 'Hệ thống đại học lớn nhất cả nước' },
    { id: 'ueh', label: 'Kinh Tế TP.HCM', region: 'Nam', students: 30000, lecturers: 1000, description: 'Trượng kinh tế trọng điểm phía Nam' },
    { id: 'ump', label: 'Y Dược TP.HCM', region: 'Nam', students: 12000, lecturers: 1300, description: 'Trung tâm đào tạo y khoa lớn nhất' },
    { id: 'hcmute', label: 'SPKT TP.HCM', region: 'Nam', students: 24000, lecturers: 900, description: 'Đào tạo giáo viên kỹ thuật' },
    { id: 'tdtu', label: 'Tôn Đức Thắng', region: 'Nam', students: 26000, lecturers: 1400, description: 'Đại học tự chủ uy tín' },
    { id: 'rmit', label: 'RMIT VN', region: 'Nam', students: 10000, lecturers: 800, description: 'Đại học quốc tế chất lượng cao' },
    { id: 'ctu', label: 'Cần Thơ', region: 'Nam', students: 45000, lecturers: 1800, description: 'Trung tâm đào tạo ĐBSCL' },
    { id: 'nlu', label: 'Nông Lâm', region: 'Nam', students: 20000, lecturers: 800, description: 'Nông nghiệp và phát triển nông thôn' },
    { id: 'fpt_hcm', label: 'FPT HCM', region: 'Nam', students: 15000, lecturers: 600, description: 'Thế mạnh CNTT và doanh nghiệp' },
];
