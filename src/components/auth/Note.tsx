interface NoteSectionProps {
    children: React.ReactNode;
}

const Note: React.FC<NoteSectionProps> = ({ children }) => (
    <div className="note-container" style={{
        backgroundColor: '#f8f9fa',
        border: '1px solid #e3e3e3',
        borderRadius: '4px',
        padding: '12px 16px',
        margin: '12px 0',
        fontSize: '14px',
        color: '#505050',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-start'
    }}>
        <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            style={{ marginRight: '8px', marginTop: '2px', flexShrink: 0 }}
            fill="#6c757d"
        >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
        </svg>
        <div>{children}</div>
    </div>
);

export default Note;