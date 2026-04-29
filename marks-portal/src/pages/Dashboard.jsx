import Header from "../components/Header.jsx";
import MarksTable from "../components/MarksTable.jsx";
import "../styles/Dashboard.css";

export default function Dashboard({user, studentData, onLogout}) {
    const sections = [
        {title: "Assignments", marks: studentData.assignments, totalAbs: 10},
        {title: "Quizzes", marks: studentData.quizzes, totalAbs: 15},
        {title: "Home Tests", marks: studentData.homeTests},
    ].filter((s) => s.marks && Object.keys(s.marks).length > 0);

    return (
        <div className='dashboard-layout'>
            <Header user={user} studentData={studentData} onLogout={onLogout} />

            <main className='dashboard-main'>
                <div className='dashboard-container'>
                    <div className='dashboard-welcome'>
                        <h1 className='dashboard-heading'>Assalamu alaikum, {studentData.name}</h1>
                        <p className='dashboard-subheading'>
                            Here are your current marks. Contact your TA for any queries @ f243053@cfd.nu.edu.pk
                        </p>
                    </div>

                    {sections.map((s) => (
                        <MarksTable key={s.title} title={s.title} marks={s.marks} maxMarks={studentData.maxMarks} totalAbs={totalAbs} />
                    ))}
                </div>
            </main>
        </div>
    );
}
