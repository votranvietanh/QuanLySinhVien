var danhSachSinhVien = new DanhSachSinhVien();


//GetStorage(); // uncomment if it's nessesary

var validate = new Validation();

//Bổ sung thuộc tính 
SinhVien.prototype.DiemToan = '';
SinhVien.prototype.DiemLy = '';
SinhVien.prototype.DiemHoa = '';
SinhVien.prototype.DTB = '';
SinhVien.prototype.Loai = '';
//Thêm phương thức
SinhVien.prototype.TinhDTB = function () {
    this.DTB = (Number(this.DiemHoa) + Number(this.DiemLy) + Number(this.DiemHoa)) / 3;
}
SinhVien.prototype.XepLoai = function () {
    if (this.DTB <= 10 && this.DTB >= 8) {
        this.Loai = "Xếp loại Giỏi";
    }
    else if (this.DTB < 8 && this.DTB >= 6.5) {
        this.Loai = "Xếp loại Khá";
    }
    else if (this.DTB < 6.5 && this.DTB >= 5) {
        this.Loai = "Xếp loại Trung Bình";
    }
    else {
        this.Loai = "Xếp loại yếu";
    }
}


function DomID(id) {
    var element = document.getElementById(id);
    return element;
}

function ThemSinhVien() {
    //Lấy dữ liệu từ người dùng nhập vào
    var masv = DomID("masv").value;
    var hoten = DomID("hoten").value;
    var cmnd = DomID("cmnd").value;
    var email = DomID("email").value;
    var sdt = DomID("sdt").value;
    var loi = 0;
    //Kiểm tra validation
    if (KiemTraDauVaoRong("masv", masv) == true) {
        loi++;
    }
    if (KiemTraDauVaoRong("hoten", hoten) == true) {
        loi++;
    }
    if (KiemTraDauVaoRong("cmnd", cmnd) == true) {
        loi++;
    }
    if (validate.KiemTraEmail(email)) {
        document.getElementById("email").style.borderColor = "green";
    }
    else {
        document.getElementById("email").style.borderColor = "red";
        loi++;
    }
    if (validate.KiemTraSoDT(sdt)) {
        document.getElementById("sdt").style.borderColor = "green";
    }
    else {
        document.getElementById("sdt").style.borderColor = "red";
        loi++;
    }
    if (loi != 0) {
        return;
    }
    //Thêm sinh viên
    var sinhvien = new SinhVien(masv, hoten, email, sdt, cmnd);
    sinhvien.DiemHoa = DomID("Toan").value;
    sinhvien.DiemLy = DomID("Ly").value;
    sinhvien.DiemHoa = DomID("Hoa").value;
    sinhvien.TinhDTB();
    sinhvien.XepLoai();
    danhSachSinhVien.ThemSinhVien(sinhvien);
    CapNhatDanhSachSV(danhSachSinhVien);
    console.log(danhSachSinhVien);
}


function KiemTraDauVaoRong(ID, value) {
    //Kiểm tra mã sinh viên rổng
    if (validate.KiemTraRong(value) == true) {
        DomID(ID).style.borderColor = "red";
        return true;
    }
    else {
        DomID(ID).style.borderColor = "green";
        return false;
    }
}


function CapNhatDanhSachSV(DanhSachSinhVien) {
    var lstTableSV = DomID("tbodySinhVien");
    lstTableSV.innerHTML = "";
    for (var i = 0; i < DanhSachSinhVien.DSSV.length; i++) {
        //Lấy thông tin sinh viên từ trong mảng sinh viên
        var sv = danhSachSinhVien.DSSV[i];
        //Tạo thẻ tr
        var trSinhVien = document.createElement("tr");
        trSinhVien.id = sv.MaSV;
        trSinhVien.className = "trSinhVien";
        trSinhVien.setAttribute("onclick", "ChinhSuaSinhVien('" + sv.MaSV + "')");
        //Tạo các thẻ td và filter dữ liệu sinh viên thứ [i] vào
        var tdCheckBox = document.createElement('td');
        var ckbMaSinhVien = document.createElement('input');
        console.log(ckbMaSinhVien);
        ckbMaSinhVien.setAttribute("class", "ckbMaSV");
        ckbMaSinhVien.setAttribute("type", "checkbox");
        ckbMaSinhVien.setAttribute("value", sv.MaSV);
        tdCheckBox.appendChild(ckbMaSinhVien);

        var tdMaSV = TaoTheTD("MaSV", sv.MaSV);
        var tdHoTen = TaoTheTD("HoTen", sv.HoTen);
        var tdCMND = TaoTheTD("CMND", sv.CMND);
        var tdEmail = TaoTheTD("Email", sv.Email);
        var tdSoDT = TaoTheTD("SoDT", sv.SoDT);

        //Tạo td  DTB và  xếp loại 
        var tdDTB = TaoTheTD("DTB", sv.DTB);
        var tdXepLoai = TaoTheTD("XepLoai", sv.Loai);
        //Append các td vào tr
        trSinhVien.appendChild(tdCheckBox);
        trSinhVien.appendChild(tdMaSV);
        trSinhVien.appendChild(tdHoTen);
        trSinhVien.appendChild(tdCMND);
        trSinhVien.appendChild(tdEmail);
        trSinhVien.appendChild(tdSoDT);
        trSinhVien.appendChild(tdDTB);
        trSinhVien.appendChild(tdXepLoai);

        //Append các tr vào tbodySinhVien
        lstTableSV.appendChild(trSinhVien);
    }

}

function TaoTheTD(className, value) {
    var td = document.createElement("td");
    td.className = className;
    td.innerHTML = value;
    return td;
}


function SetStorage() {
    //Chuyển đổi object mảng danh sách sinh viên thành chuỗi json
    var jsonDanhSachSinhVien = JSON.stringify(danhSachSinhVien.DSSV);
    //Rồi đem chuỗi json lưu vào storage và đặt tên là DanhSachSV
    localStorage.setItem("DanhSachSV", jsonDanhSachSinhVien);
}

function GetStorage() {
    //Lấy ra chuỗi json là mảng danhsachsinhvien thông qua tên DanhSachSV
    var jsonDanhSachSinhVien = localStorage.getItem("DanhSachSV");
    var mangDSSV = JSON.parse(jsonDanhSachSinhVien);
    danhSachSinhVien.DSSV = mangDSSV;
    CapNhatDanhSachSV(danhSachSinhVien);

}
//Xóa sinh viên
function XoaSinhVien() {
    //Mảng checkbox
    var lstMaSV = document.getElementsByClassName("ckbMaSV");
    //Mảng mã sinh viên được chọn
    var lstMaSVDuocChon = [];
    for (i = 0; i < lstMaSV.length; i++) {
        console.log(lstMaSV[i]);
        if (lstMaSV[i].checked) //Kiểm phần tử checkbox đó có được chọn hay chưa
        {
            lstMaSVDuocChon.push(lstMaSV[i].value);
        }
    }
    danhSachSinhVien.XoaSinhVien(lstMaSVDuocChon);
    CapNhatDanhSachSV(danhSachSinhVien);
}


function TimKiemSinhVien() {
    var tukhoa = DomID("tukhoa").value;
    var lstDanhSachSinhVienTimKiem = danhSachSinhVien.TimKiemSinhVien(tukhoa);
    CapNhatDanhSachSV(lstDanhSachSinhVienTimKiem);
}



function ChinhSuaSinhVien(masv) {

    var sinhvien = danhSachSinhVien.TimSVTheoMa(masv);
    console.log("dc");
    if (sinhvien != null) {
        DomID("masv").value = sinhvien.MaSV;
        DomID("hoten").value = sinhvien.HoTen;
        DomID("cmnd").value = sinhvien.CMND;
        DomID("email").value = sinhvien.Email;
        DomID("sdt").value = sinhvien.SoDT;
        
    }

}

function LuuThongTin() {
    //Lấy dữ liệu từ người dùng nhập vào
    var masv = DomID("masv").value;
    var hoten = DomID("hoten").value;
    var cmnd = DomID("cmnd").value;
    var email = DomID("email").value;
    var sdt = DomID("sdt").value;
    var loi = 0;
    //Kiểm tra validation
    if (KiemTraDauVaoRong("masv", masv) == true) {
        loi++;
    }
    if (KiemTraDauVaoRong("hoten", hoten) == true) {
        loi++;
    }
    if (KiemTraDauVaoRong("cmnd", cmnd) == true) {
        loi++;
    }
    if (validate.KiemTraEmail(email)) {
        document.getElementById("email").style.borderColor = "green";
    }
    else {
        document.getElementById("email").style.borderColor = "red";
        loi++;
    }
    if (validate.KiemTraSoDT(sdt)) {
        document.getElementById("sdt").style.borderColor = "green";
    }
    else {
        document.getElementById("sdt").style.borderColor = "red";
        loi++;
    }
    if (loi != 0) {
        return;
    }
    //Thêm sinh viên
    var sinhvien = new SinhVien(masv, hoten, email, sdt, cmnd);
    sinhvien.DiemHoa = DomID("Toan").value;
    sinhvien.DiemLy = DomID("Ly").value;
    sinhvien.DiemHoa = DomID("Hoa").value;
    sinhvien.TinhDTB();
    sinhvien.XepLoai();
    danhSachSinhVien.SuaSinhVien(sinhvien);
    CapNhatDanhSachSV(danhSachSinhVien);
}


