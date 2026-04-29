/* 

Group Two
Dr. Porter
CSCI 3300 

Angie

*/

/* components/alerts/AlertsList.jsx - Displays dismissible automatic grade alerts */

export default function AlertsList({ alerts = [], onDismiss }) {
    const visible = alerts.filter(a => !a.isDismissed);
    if (visible.length === 0) return null;

    const colors = {
        error:   { bg: '#fee2e2', border: '#ef4444', text: '#991b1b' },
        warning: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' },
        info:    { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' },
        success: { bg: '#d1fae5', border: '#10b981', text: '#065f46' },
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {visible.map(alert => {
                const style = colors[alert.type] || colors.info;
                return (
                    <div
                        key={alert.id}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '10px 14px',
                            borderRadius: '6px',
                            border: `1px solid ${style.border}`,
                            backgroundColor: style.bg,
                            color: style.text,
                            fontSize: '14px',
                        }}
                    >
                        <span>{alert.message}</span>
                        <button
                            onClick={() => onDismiss(alert.id)}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: style.text,
                                fontSize: '16px',
                                lineHeight: 1,
                                padding: '0 4px',
                                marginLeft: '12px',
                            }}
                        >
                            ✕
                        </button>
                    </div>
                );
            })}
        </div>
    );
}

