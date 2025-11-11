import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import type { StorageItem } from '../../types';
import { GrLocation } from 'react-icons/gr';
import { BiCategoryAlt } from 'react-icons/bi';
import { PiHandArrowUp, PiTimerBold } from 'react-icons/pi';
import { ui, alpha } from '../../lib/uiTokens';
import { db } from '../../lib/firebase';
import { setDoc, collection, serverTimestamp, doc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { buildReminderMessage } from '../../lib/reminders';
import MetaRow from '../MetaRow';
import { getDaysLeft, getOverdueDays } from '../../lib/date';

export function LentSection({ items }: { items: StorageItem[] }) {
  const navigate = useNavigate();
  const hasLent = items.length > 0;
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant='h4' fontWeight={700} color={ui.text}>
          Lent
        </Typography>
        <Button
          component={RouterLink}
          to='/storage'
          variant='outlined'
          size='small'
          sx={{
            borderColor: ui.primary,
            color: ui.primary,
            '&:hover': {
              borderColor: ui.primaryHover,
              bgcolor: alpha(ui.primary, 0.08),
            },
            textTransform: 'none',
            borderRadius: 9999,
            fontWeight: 700,
          }}
        >
          View All
        </Button>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {hasLent ? (
          items.slice(0, 3).map((item) => (
            <Card
              key={item.id}
              onClick={() => navigate(`/item/${item.id}`)}
              sx={{
                bgcolor: '#0f0f10',
                background: '#1b1b1c',
                backgroundImage: 'none',
                p: 1.5,
                borderRadius: 2,
                boxShadow: 'none',
                border: `1px solid ${ui.border}`,
                display: 'flex',
                gap: 2,
                color: ui.text,
                cursor: 'pointer',
              }}
            >
              <Box
                sx={{
                  width: 160,
                  height: 160,
                  borderRadius: 1.2,
                  bgcolor: '#424242',
                  backgroundImage: item.imageUrls?.[0]
                    ? `url(${item.imageUrls[0]})`
                    : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  flexShrink: 0,
                  textDecoration: 'none',
                }}
              />
              <Box
                sx={{
                  flex: 1,
                  minWidth: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 160,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 0.25,
                    }}
                  >
                    <Typography
                      variant='subtitle2'
                      fontWeight={700}
                      sx={{
                        fontSize: 22,
                        color: ui.text,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        mb: 0.75,
                      }}
                    >
                      {item.title}
                    </Typography>
                    <MetaRow
                      icon={
                        <BiCategoryAlt
                          style={{ fontSize: 14, color: ui.subtext }}
                        />
                      }
                      label='Category'
                      value={item.category}
                    />
                    <MetaRow
                      icon={
                        <GrLocation
                          style={{ fontSize: 14, color: ui.subtext }}
                        />
                      }
                      label='Location'
                      value={item.location || '—'}
                    />
                    <MetaRow
                      icon={
                        <PiHandArrowUp
                          style={{ fontSize: 16, color: ui.subtext }}
                        />
                      }
                      label='Borrower'
                      value={item.holderName || 'Unknown'}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      gap: 0.5,
                    }}
                  >
                    {(() => {
                      const daysLeft = getDaysLeft(item.borrowedUntil);
                      const overdue = getOverdueDays(item.borrowedUntil);
                      let label = '';
                      let colorHex: string = ui.primary;
                      let bg: string = alpha(ui.primary, 0.14);

                      if (overdue > 0) {
                        colorHex = '#FF8A8A';
                        bg = alpha('#FF8A8A', 0.16);
                        label = `Overdue ${overdue} days`;
                      } else if (daysLeft === 0) {
                        colorHex = '#FFB37A';
                        bg = alpha('#FFB37A', 0.16);
                        label = 'Return today';
                      } else {
                        label = `Due in ${daysLeft} days`;
                      }

                      return (
                        <Chip
                          icon={<PiTimerBold style={{ fontSize: 14 }} />}
                          label={label}
                          size='small'
                          sx={{
                            height: 20,
                            fontSize: '0.7rem',
                            bgcolor: bg,
                            color: colorHex,
                            '& .MuiChip-icon': { color: colorHex },
                          }}
                        />
                      );
                    })()}
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 1,
                    mt: 'auto',
                    pt: 1,
                  }}
                >
                  <Button
                    size='small'
                    onClick={async (e) => {
                      e.stopPropagation();
                      const hasDue = !!item.borrowedUntil;
                      if (!hasDue) return;
                      const msUntil = new Date(String(item.borrowedUntil)).getTime() - Date.now();
                      const canRemind = msUntil < 3 * 24 * 60 * 60 * 1000;
                      if (!canRemind) return;
                      try {
                        const msg = buildReminderMessage({ ownerName: item.ownerName, itemName: item.title, dueDate: item.borrowedUntil });
                        if (!msg) return;
                        const nid = uuidv4();
                        await setDoc(doc(collection(db, 'notifications'), nid), {
                          id: nid,
                          type: 'reminder',
                          ownerId: item.ownerId,
                          ownerName: item.ownerName || null,
                          borrowerId: item.holderId || null,
                          borrowerName: item.holderName || null,
                          itemId: item.id,
                          itemTitle: item.title,
                          message: msg,
                          read: false,
                          createdAt: serverTimestamp(),
                        });
                      } catch (err) {
                        // eslint-disable-next-line no-console
                        console.error('Remind failed', err);
                      }
                    }}
                    sx={{
                      bgcolor: alpha(ui.primary, 0.12),
                      color: ui.primary,
                      borderRadius: 9999,
                      fontWeight: 700,
                      textTransform: 'none',
                      px: 1.5,
                      height: 32,
                      '&:hover': { bgcolor: alpha(ui.primary, 0.18) },
                      flex: 1,
                      width: '100%',
                    }}
                  >
                    Remind
                  </Button>
                  <Button
                    variant='contained'
                    size='small'
                    onClick={(e) => e.stopPropagation()}
                    sx={{
                      bgcolor: ui.primary,
                      color: '#0A0A0A',
                      textTransform: 'none',
                      borderRadius: 2,
                      height: 32,
                      px: 1.5,
                      '&:hover': { bgcolor: ui.primaryHover },
                      flex: 1,
                      width: '100%',
                    }}
                  >
                    Mark Return
                  </Button>
                </Box>
              </Box>
            </Card>
          ))
        ) : (
          <Typography variant='body2' color='text.secondary'>
            You haven't lent anything yet.
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default LentSection;
