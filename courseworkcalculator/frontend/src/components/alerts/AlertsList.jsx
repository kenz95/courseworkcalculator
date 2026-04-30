/* 

Group Two
Dr. Porter
CSCI 3300 

Angie
& Edits by Mackenzie to fix formatting & certain styles 

*/

/* components/alerts/AlertsList.jsx - Displays dismissible automatic grade alerts */

// Import Icons 
import Icon from '../../utils/Icon';

export default function AlertsList({ alerts = [], onDismiss }) {
    const visible = alerts.filter(a => !a.isDismissed);
    if (visible.length === 0) return null;

    const colors = {
        error:   { bg: '#fee2e2', border: '#ef4444', text: '#991b1b' },
        warning: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' },
        info:    { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' },
        success: { bg: '#d1fae5', border: '#10b981', text: '#065f46' },
    };

    // Map alert type to icon name and color
    const alertIcon = {
        error:   { name: 'error',   color: 'white' },
        warning: { name: 'warning', color: 'dark'  },
        info:    { name: 'info',    color: 'dark'  },
        success: { name: 'chart',   color: 'dark'  },
    };

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '10px', 
            margin: '16px 0', 
            padding: '0 4px',
        }}>
            {visible.map(alert => {
                const style = colors[alert.type] || colors.info;
                return (
                    <div
                        key={alert.id}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: `1px solid ${style.border}`,
                            backgroundColor: style.bg,
                            color: style.text,
                            fontSize: '14px',
                            lineHeight: '1.5',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Icon name={alertIcon[alert.type]?.name || 'info'}
                                size={16}
                                color={alertIcon[alert.type]?.color || 'dark'}
                                style={{ flexShrink: 0 }}
                            />
                            <span>{alert.message}</span>
                        </div>

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

