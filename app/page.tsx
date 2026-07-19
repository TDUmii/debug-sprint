"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type ChuDe = "bien" | "nhap-xuat" | "toan-tu" | "dieu-kien" | "logic";
type PhepBoTro = "them-gio" | "loai-tru" | "nhan-doi";
type CauHoi = {
  id: number;
  chuDe: ChuDe;
  tieuDe: string;
  moTa: string;
  code: string[];
  dapAn: string[];
  dung: number;
  giaiThich: string;
};

const CHU_DE: { id: ChuDe; ten: string; moTa: string; kyHieu: string; mau: string }[] = [
  { id: "bien", ten: "Biến & kiểu dữ liệu", moTa: "int, double, char, khai báo biến", kyHieu: "int", mau: "#c9ff36" },
  { id: "nhap-xuat", ten: "Nhập & xuất", moTa: "cin, cout và toán tử << >>", kyHieu: "IO", mau: "#38e8f2" },
  { id: "toan-tu", ten: "Toán tử", moTa: "+, -, *, /, %, so sánh", kyHieu: "+−", mau: "#ffb84d" },
  { id: "dieu-kien", ten: "Điều kiện if", moTa: "if đơn giản, chưa sử dụng else", kyHieu: "if", mau: "#ff7a5c" },
  { id: "logic", ten: "Cổng logic", moTa: "AND, OR, NOT và bảng chân trị", kyHieu: "&&", mau: "#b798ff" },
];

const NGAN_HANG: CauHoi[] = [
  { id: 1, chuDe: "bien", tieuDe: "Khai báo biến số nguyên", moTa: "Chọn dòng tạo biến tuoi có giá trị 15.", code: ["// Chọn câu lệnh đúng"], dapAn: ["int tuoi = 15;", "tuoi int = 15;", "integer tuoi: 15;", "int = tuoi 15;"], dung: 0, giaiThich: "C++ khai báo theo thứ tự: kiểu dữ liệu, tên biến, dấu = và giá trị." },
  { id: 2, chuDe: "bien", tieuDe: "Chọn kiểu dữ liệu phù hợp", moTa: "Biến diemTrungBinh cần lưu giá trị 8.75.", code: ["___ diemTrungBinh = 8.75;"], dapAn: ["int", "char", "double", "bool"], dung: 2, giaiThich: "double lưu được số có phần thập phân như 8.75." },
  { id: 3, chuDe: "bien", tieuDe: "Giá trị mới của biến", moTa: "Theo dõi phép gán để tìm giá trị cuối.", code: ["int soKeo = 5;", "soKeo = 9;"], dapAn: ["5", "9", "14", "Lỗi"], dung: 1, giaiThich: "Phép gán thứ hai thay giá trị 5 bằng 9." },
  { id: 4, chuDe: "bien", tieuDe: "Tên biến hợp lệ", moTa: "Tên nào có thể dùng trong C++?", code: ["// Quy tắc đặt tên biến"], dapAn: ["2diem", "diem trung binh", "diem_trung_binh", "int"], dung: 2, giaiThich: "Tên biến không bắt đầu bằng số, không chứa khoảng trắng và không trùng từ khóa." },
  { id: 5, chuDe: "nhap-xuat", tieuDe: "In lời chào ra màn hình", moTa: "Hoàn thiện câu lệnh xuất.", code: ["___ << \"Xin chao!\";"], dapAn: ["cin", "cout", "print", "input"], dung: 1, giaiThich: "cout cùng toán tử << dùng để đưa dữ liệu ra màn hình." },
  { id: 6, chuDe: "nhap-xuat", tieuDe: "Nhập tuổi từ bàn phím", moTa: "Chọn câu lệnh đọc dữ liệu vào biến tuoi.", code: ["int tuoi;", "// Đọc tuổi tại đây"], dapAn: ["cin >> tuoi;", "cout >> tuoi;", "cin << tuoi;", "tuoi << cin;"], dung: 0, giaiThich: "cin dùng toán tử >> để đưa dữ liệu người dùng nhập vào biến." },
  { id: 7, chuDe: "nhap-xuat", tieuDe: "Kết quả xuất là gì?", moTa: "Đọc từ trái sang phải trong câu lệnh cout.", code: ["int a = 4;", "cout << \"a = \" << a;"], dapAn: ["a = a", "4 = a", "a = 4", "a4"], dung: 2, giaiThich: "Chuỗi 'a = ' được in trước, sau đó là giá trị 4 của biến a." },
  { id: 8, chuDe: "nhap-xuat", tieuDe: "Xuống dòng sau khi in", moTa: "Chọn thành phần thường dùng để xuống dòng.", code: ["cout << \"Dong 1\" << ___;"], dapAn: ["endl", "end", "line", "break"], dung: 0, giaiThich: "endl kết thúc dòng hiện tại và chuyển con trỏ xuống dòng mới." },
  { id: 9, chuDe: "toan-tu", tieuDe: "Thứ tự thực hiện phép tính", moTa: "Tính giá trị của biểu thức.", code: ["int ketQua = 2 + 3 * 4;"], dapAn: ["20", "14", "24", "9"], dung: 1, giaiThich: "Phép nhân thực hiện trước: 3 × 4 = 12, sau đó cộng 2 được 14." },
  { id: 10, chuDe: "toan-tu", tieuDe: "Tìm số dư", moTa: "Toán tử % trả về phần dư của phép chia.", code: ["int du = 17 % 5;"], dapAn: ["3", "2", "5", "12"], dung: 1, giaiThich: "17 chia 5 được 3 dư 2, nên 17 % 5 bằng 2." },
  { id: 11, chuDe: "toan-tu", tieuDe: "Phân biệt = và ==", moTa: "Toán tử nào kiểm tra hai giá trị bằng nhau?", code: ["a ___ b"], dapAn: ["=", "==", "!=", ">="], dung: 1, giaiThich: "== dùng để so sánh bằng nhau; = dùng để gán giá trị." },
  { id: 12, chuDe: "toan-tu", tieuDe: "Phép chia số nguyên", moTa: "Cả hai toán hạng đều có kiểu int.", code: ["int x = 7 / 2;"], dapAn: ["3.5", "4", "3", "2"], dung: 2, giaiThich: "Phép chia giữa hai số nguyên bỏ phần thập phân, nên kết quả là 3." },
  { id: 13, chuDe: "dieu-kien", tieuDe: "Điều kiện có chạy không?", moTa: "Xác định kết quả của phép so sánh.", code: ["int tuoi = 15;", "if (tuoi >= 12) {", "  cout << \"Du tuoi\";", "}"], dapAn: ["Có, vì 15 >= 12", "Không, vì thiếu else", "Không, vì 15 < 12", "Chương trình lỗi"], dung: 0, giaiThich: "15 lớn hơn hoặc bằng 12 nên khối lệnh bên trong if được chạy." },
  { id: 14, chuDe: "dieu-kien", tieuDe: "Chọn điều kiện số dương", moTa: "In thông báo khi n lớn hơn 0.", code: ["if (___) {", "  cout << \"So duong\";", "}"], dapAn: ["n = 0", "n < 0", "n > 0", "n == -1"], dung: 2, giaiThich: "Số dương là số lớn hơn 0, vì vậy điều kiện là n > 0." },
  { id: 15, chuDe: "dieu-kien", tieuDe: "Kiểm tra số chẵn", moTa: "Dùng số dư để nhận biết số chẵn.", code: ["if (___) {", "  cout << \"So chan\";", "}"], dapAn: ["n % 2 == 0", "n / 2 == 0", "n % 2 == 1", "n * 2 == 0"], dung: 0, giaiThich: "Một số chẵn khi chia 2 có số dư bằng 0." },
  { id: 16, chuDe: "dieu-kien", tieuDe: "Cú pháp if đúng", moTa: "Chọn câu lệnh có cú pháp C++ hợp lệ.", code: ["// Chọn một đáp án"], dapAn: ["if diem > 5 {}", "if (diem > 5) {}", "if diem > 5 then", "if [diem > 5]"], dung: 1, giaiThich: "Điều kiện của if trong C++ được đặt bên trong cặp ngoặc tròn." },
  { id: 17, chuDe: "logic", tieuDe: "Cổng AND", moTa: "Kết quả chỉ đúng khi cả hai đầu vào đều đúng.", code: ["true && false"], dapAn: ["true", "false", "1 và 0", "Lỗi"], dung: 1, giaiThich: "AND (&&) chỉ cho kết quả true khi cả hai vế đều true." },
  { id: 18, chuDe: "logic", tieuDe: "Cổng OR", moTa: "Chỉ cần một đầu vào đúng.", code: ["false || true"], dapAn: ["true", "false", "Không xác định", "Lỗi"], dung: 0, giaiThich: "OR (||) trả về true khi có ít nhất một vế là true." },
  { id: 19, chuDe: "logic", tieuDe: "Cổng NOT", moTa: "Toán tử ! đảo ngược giá trị logic.", code: ["bool denTat = false;", "cout << !denTat;"], dapAn: ["false", "0", "true (1)", "denTat"], dung: 2, giaiThich: "NOT của false là true; cout thường biểu diễn true bằng 1." },
  { id: 20, chuDe: "logic", tieuDe: "Kết hợp AND trong if", moTa: "Khối lệnh chạy khi điểm đạt và còn thời gian.", code: ["int diem = 8;", "int thoiGian = 3;", "if (diem >= 5 && thoiGian > 0) {", "  cout << \"Qua man\";", "}"], dapAn: ["Có chạy", "Không chạy", "Thiếu else", "Lỗi vì dùng &&"], dung: 0, giaiThich: "Cả 8 >= 5 và 3 > 0 đều đúng, nên biểu thức AND đúng." },
  { id: 21, chuDe: "logic", tieuDe: "Kết hợp OR trong if", moTa: "Chỉ cần một điều kiện đúng để mở cửa.", code: ["bool coChiaKhoa = false;", "bool coMatMa = true;", "if (coChiaKhoa || coMatMa) {", "  cout << \"Mo cua\";", "}"], dapAn: ["Không mở", "Mở cửa", "Thiếu &&", "Lỗi kiểu bool"], dung: 1, giaiThich: "coMatMa là true nên biểu thức OR đúng dù coChiaKhoa là false." },
  { id: 22, chuDe: "toan-tu", tieuDe: "Tăng biến thêm một", moTa: "Câu lệnh nào làm soLuong tăng từ 6 lên 7?", code: ["int soLuong = 6;", "___;"], dapAn: ["soLuong--;", "soLuong++;", "soLuong == 1;", "soLuong =+ 0;"], dung: 1, giaiThich: "Toán tử ++ tăng giá trị của biến thêm 1." },
  { id: 23, chuDe: "nhap-xuat", tieuDe: "Nhập hai số", moTa: "Chọn câu lệnh đọc lần lượt a và b.", code: ["int a, b;", "___"], dapAn: ["cin >> a >> b;", "cout << a << b;", "cin << a << b;", "input(a, b);"], dung: 0, giaiThich: "Có thể nối nhiều toán tử >> để nhập liên tiếp nhiều biến bằng cin." },
  { id: 24, chuDe: "bien", tieuDe: "Kiểu ký tự", moTa: "Chọn khai báo đúng cho một ký tự đơn.", code: ["// Lưu chữ A"], dapAn: ["string x = 'A';", "char x = 'A';", "int x = \"A\";", "char x = \"ABC\";"], dung: 1, giaiThich: "char lưu một ký tự và ký tự được đặt trong dấu nháy đơn." },
];

const TEN_BO_TRO: Record<PhepBoTro, { ten: string; moTa: string; bieuTuong: string }> = {
  "them-gio": { ten: "+10 giây", moTa: "Cộng ngay 10 giây", bieuTuong: "+10" },
  "loai-tru": { ten: "Loại trừ", moTa: "Ẩn 2 đáp án sai", bieuTuong: "½" },
  "nhan-doi": { ten: "Nhân đôi", moTa: "Điểm câu đúng kế tiếp ×2", bieuTuong: "2×" },
};

const tronMang = <T,>(mang: T[]) => [...mang].sort(() => Math.random() - 0.5);

export default function Home() {
  const [manHinh, setManHinh] = useState<"cau-hinh" | "choi" | "ket-thuc">("cau-hinh");
  const [chuDeChon, setChuDeChon] = useState<ChuDe[]>(CHU_DE.map((m) => m.id));
  const [soCau, setSoCau] = useState(10);
  const [deThi, setDeThi] = useState<CauHoi[]>([]);
  const [viTri, setViTri] = useState(0);
  const [diem, setDiem] = useState(0);
  const [chuoi, setChuoi] = useState(0);
  const [thoiGian, setThoiGian] = useState(30);
  const [daChon, setDaChon] = useState<number | null>(null);
  const [boTro, setBoTro] = useState<Record<PhepBoTro, number>>({ "them-gio": 0, "loai-tru": 0, "nhan-doi": 0 });
  const [anDapAn, setAnDapAn] = useState<number[]>([]);
  const [nhanDoi, setNhanDoi] = useState(false);
  const [thongBao, setThongBao] = useState("");
  const [kyLuc, setKyLuc] = useState(0);

  useEffect(() => setKyLuc(Number(localStorage.getItem("debug-sprint-ky-luc") || 0)), []);

  const cauHoi = deThi[viTri];
  const tongKhaDung = NGAN_HANG.filter((c) => chuDeChon.includes(c.chuDe)).length;

  const batDau = () => {
    if (!chuDeChon.length) return;
    const nganHangLoc = NGAN_HANG.filter((c) => chuDeChon.includes(c.chuDe));
    setDeThi(tronMang(nganHangLoc).slice(0, Math.min(soCau, nganHangLoc.length)));
    setViTri(0); setDiem(0); setChuoi(0); setThoiGian(30); setDaChon(null);
    setBoTro({ "them-gio": 0, "loai-tru": 0, "nhan-doi": 0 });
    setAnDapAn([]); setNhanDoi(false); setThongBao(""); setManHinh("choi");
  };

  const doiChuDe = (id: ChuDe) => setChuDeChon((cu) => cu.includes(id) ? cu.filter((x) => x !== id) : [...cu, id]);

  const nhanBoTroNgauNhien = () => {
    if (Math.random() > 0.45) return;
    const loai = tronMang<PhepBoTro>(["them-gio", "loai-tru", "nhan-doi"])[0];
    setBoTro((cu) => ({ ...cu, [loai]: cu[loai] + 1 }));
    setThongBao(`Nhận được phép bổ trợ: ${TEN_BO_TRO[loai].ten}!`);
    window.setTimeout(() => setThongBao(""), 2600);
  };

  const chonDapAn = useCallback((chiSo: number) => {
    if (!cauHoi || daChon !== null || anDapAn.includes(chiSo)) return;
    setDaChon(chiSo);
    if (chiSo === cauHoi.dung) {
      const thuong = (100 + thoiGian * 4 + chuoi * 15) * (nhanDoi ? 2 : 1);
      setDiem((cu) => cu + thuong); setChuoi((cu) => cu + 1); setNhanDoi(false);
      nhanBoTroNgauNhien();
    } else setChuoi(0);
  }, [anDapAn, cauHoi, chuoi, daChon, nhanDoi, thoiGian]);

  const dungBoTro = (loai: PhepBoTro) => {
    if (!cauHoi || boTro[loai] <= 0 || daChon !== null) return;
    if (loai === "them-gio") setThoiGian((cu) => cu + 10);
    if (loai === "loai-tru") setAnDapAn(tronMang([0, 1, 2, 3].filter((x) => x !== cauHoi.dung)).slice(0, 2));
    if (loai === "nhan-doi") setNhanDoi(true);
    setBoTro((cu) => ({ ...cu, [loai]: cu[loai] - 1 }));
  };

  const tiepTheo = useCallback(() => {
    if (viTri >= deThi.length - 1) {
      const moi = Math.max(kyLuc, diem); localStorage.setItem("debug-sprint-ky-luc", String(moi)); setKyLuc(moi); setManHinh("ket-thuc"); return;
    }
    setViTri((cu) => cu + 1); setDaChon(null); setThoiGian(30); setAnDapAn([]);
  }, [deThi.length, diem, kyLuc, viTri]);

  useEffect(() => {
    if (manHinh !== "choi" || daChon !== null) return;
    if (thoiGian <= 0) { setDaChon(-1); setChuoi(0); return; }
    const id = window.setTimeout(() => setThoiGian((cu) => cu - 1), 1000);
    return () => window.clearTimeout(id);
  }, [daChon, manHinh, thoiGian]);

  useEffect(() => {
    const xuLy = (e: KeyboardEvent) => {
      if (manHinh === "choi" && e.key >= "1" && e.key <= "4") chonDapAn(Number(e.key) - 1);
      if (manHinh === "choi" && e.key === "Enter" && daChon !== null) tiepTheo();
    };
    addEventListener("keydown", xuLy); return () => removeEventListener("keydown", xuLy);
  }, [chonDapAn, daChon, manHinh, tiepTheo]);

  const tenChuDe = useMemo(() => CHU_DE.find((m) => m.id === cauHoi?.chuDe)?.ten || "", [cauHoi]);

  return (
    <main className="game-shell">
      <header className="topbar">
        <button className="brand brand-button" onClick={() => setManHinh("cau-hinh")}><span className="brand-mark">C++</span><span>DEBUG <b>SPRINT</b></span></button>
        <div className="live-pill"><span /> LUYỆN TẬP C++ CƠ BẢN</div>
        <div className="header-stats"><div><small>NGÂN HÀNG</small><strong>{NGAN_HANG.length} CÂU</strong></div><div><small>KỶ LỤC</small><strong className="lime">{kyLuc}</strong></div></div>
      </header>

      {manHinh === "cau-hinh" && (
        <section className="setup-screen">
          <div className="setup-hero"><span className="eyebrow">TẠO MỘT LƯỢT CHƠI MỚI</span><h1>Hôm nay lớp mình<br /><em>luyện kiến thức gì?</em></h1><p>Chọn một hoặc nhiều chủ đề. Mỗi lượt chơi sẽ lấy đề ngẫu nhiên đúng từ các nội dung đã chọn.</p></div>
          <div className="setup-panel">
            <div className="setup-panel-head"><div><small>BƯỚC 01</small><h2>Chọn kiến thức</h2></div><button onClick={() => setChuDeChon(chuDeChon.length === CHU_DE.length ? [] : CHU_DE.map((m) => m.id))}>{chuDeChon.length === CHU_DE.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}</button></div>
            <div className="topic-list">
              {CHU_DE.map((muc) => <label key={muc.id} className={chuDeChon.includes(muc.id) ? "selected" : ""}><input type="checkbox" checked={chuDeChon.includes(muc.id)} onChange={() => doiChuDe(muc.id)} /><i style={{ color: muc.mau, borderColor: `${muc.mau}66` }}>{muc.kyHieu}</i><span><strong>{muc.ten}</strong><small>{muc.moTa}</small></span><b>✓</b></label>)}
            </div>
            <div className="question-count"><div><small>BƯỚC 02</small><h2>Số câu trong lượt</h2></div><div className="count-options">{[5, 10, 15, 20].map((n) => <button key={n} className={soCau === n ? "active" : ""} onClick={() => setSoCau(n)}>{n}</button>)}</div></div>
            <div className="setup-summary"><span><b>{chuDeChon.length}</b> chủ đề · <b>{Math.min(soCau, tongKhaDung)}</b> câu ngẫu nhiên</span><button disabled={!chuDeChon.length} onClick={batDau}>TẠO TRÒ CHƠI <b>→</b></button></div>
          </div>
        </section>
      )}

      {manHinh === "choi" && cauHoi && (
        <>
          <div className="progress-track"><span style={{ width: `${((viTri + 1) / deThi.length) * 100}%` }} /></div>
          {thongBao && <div className="power-toast">⚡ {thongBao}</div>}
          <section className="game-grid">
            <div className="challenge-column">
              <div className="round-row"><span>CÂU {String(viTri + 1).padStart(2, "0")} / {String(deThi.length).padStart(2, "0")} · {tenChuDe}</span><div className={`timer ${thoiGian <= 7 ? "urgent" : ""}`}><i /> 00:{String(thoiGian).padStart(2, "0")}</div></div>
              <article className="challenge-card">
                <div className="challenge-copy"><span className="topic">C++ · {tenChuDe}</span><h1>{cauHoi.tieuDe}</h1><p>{cauHoi.moTa}</p></div>
                <div className="code-window"><div className="window-bar"><span /><span /><span /><b>main.cpp</b></div><pre>{cauHoi.code.map((dong, i) => <code key={i}><em>{String(i + 1).padStart(2, "0")}</em>{dong}{"\n"}</code>)}</pre></div>
              </article>
              <div className="answers">{cauHoi.dapAn.map((dapAn, i) => { const dung = daChon !== null && i === cauHoi.dung; const sai = daChon === i && i !== cauHoi.dung; const biAn = anDapAn.includes(i); return <button key={dapAn} className={`answer ${dung ? "correct" : ""} ${sai ? "wrong" : ""} ${biAn ? "hidden-answer" : ""}`} disabled={daChon !== null || biAn} onClick={() => chonDapAn(i)}><kbd>{i + 1}</kbd><span>{biAn ? "Đã loại trừ" : dapAn}</span><b>{dung ? "✓" : sai ? "×" : "→"}</b></button>; })}</div>
              {daChon !== null && <div className={`feedback ${daChon === cauHoi.dung ? "is-correct" : "is-wrong"}`}><div><strong>{daChon === cauHoi.dung ? "Chính xác!" : daChon === -1 ? "Hết giờ!" : "Chưa đúng rồi!"}</strong><p>{cauHoi.giaiThich}</p></div><button onClick={tiepTheo}>{viTri === deThi.length - 1 ? "XEM KẾT QUẢ" : "CÂU TIẾP THEO"} <span>↵</span></button></div>}
            </div>
            <aside className="sidebar">
              <section className="score-card"><small>ĐIỂM HIỆN TẠI</small><strong>{diem.toLocaleString("vi-VN")}</strong><div><span>CHUỖI ĐÚNG <b>{chuoi}×</b></span>{nhanDoi && <span className="double-ready">2× ĐÃ SẴN SÀNG</span>}</div></section>
              <section className="side-card power-card"><div className="side-heading"><div><small>KHO VẬT PHẨM</small><h2>PHÉP BỔ TRỢ</h2></div><span>NGẪU NHIÊN</span></div><p className="power-help">Trả lời đúng có cơ hội nhận phép bổ trợ. Bấm để dùng trước khi chọn đáp án.</p><div className="power-list">{(Object.keys(TEN_BO_TRO) as PhepBoTro[]).map((loai) => <button key={loai} disabled={boTro[loai] <= 0 || daChon !== null || (loai === "nhan-doi" && nhanDoi)} onClick={() => dungBoTro(loai)}><i>{TEN_BO_TRO[loai].bieuTuong}</i><span><strong>{TEN_BO_TRO[loai].ten}</strong><small>{TEN_BO_TRO[loai].moTa}</small></span><b>×{boTro[loai]}</b></button>)}</div></section>
              <section className="teacher-tip"><span>MẸO TỔ CHỨC LỚP</span><p>Chiếu game lên màn hình, cho các nhóm thảo luận 15 giây rồi cùng giơ bảng đáp án 1–4.</p></section>
            </aside>
          </section>
        </>
      )}

      {manHinh === "ket-thuc" && <section className="result-wrap"><article className="finish-card"><span className="finish-icon">🏁</span><p>LƯỢT CHƠI HOÀN TẤT</p><h1>{diem >= deThi.length * 170 ? "Cả lớp quá xuất sắc!" : "Một lượt luyện tập tốt!"}</h1><div className="final-score">{diem.toLocaleString("vi-VN")}<small>ĐIỂM · {deThi.length} CÂU</small></div><div className="result-actions"><button onClick={batDau}>CHƠI LẠI CÙNG CHỦ ĐỀ ↻</button><button className="secondary" onClick={() => setManHinh("cau-hinh")}>ĐỔI KIẾN THỨC</button></div></article></section>}
      <footer><span>DEBUG SPRINT · C++ CƠ BẢN · CHẠY LOCAL</span><span>Dùng phím <kbd>1</kbd>–<kbd>4</kbd> để chọn · <kbd>Enter</kbd> để tiếp tục</span></footer>
    </main>
  );
}
