import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import type { StorageItem } from '../../types';
import { GrLocation } from 'react-icons/gr';
import { BiCategoryAlt } from 'react-icons/bi';
import { PiTimerBold, PiHandArrowDown } from 'react-icons/pi';
import { getDaysLeft, getOverdueDays } from '../../lib/date';
import { ui, alpha } from '../../lib/uiTokens';
import MetaRow from '../MetaRow';

export function BorrowedSection({ items }: { items: StorageItem[] }) {
  const navigate = useNavigate();
  const hasBorrowed = items.length > 0;
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
          Borrowed
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
        {hasBorrowed ? (
          items.slice(0, 3).map((item) => (
            <Card
              key={item.id}
              onClick={() => navigate(`/item/${item.id}`)}
              sx={{
                bgcolor: '#0f0f10',
                background: '#0f0f10',
                backgroundImage: 'none',
                p: 1.5,
                borderRadius: 2,
                boxShadow: 'none',
                border: `1px solid ${ui.border}`,
                color: ui.text,
                cursor: 'pointer',
              }}
            >
              <Box sx={{ display: 'flex', gap: 2 }}>
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
                          <PiHandArrowDown
                            style={{ fontSize: 16, color: ui.subtext }}
                          />
                        }
                        label='Lender'
                        value={item.ownerName || 'Unknown'}
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
                        let colorHex: string = ui.primary; // lime by default
                        let bg: string = alpha(ui.primary, 0.14);

                        if (overdue > 0) {
                          // Red pastel
                          colorHex = '#FF8A8A';
                          bg = alpha('#FF8A8A', 0.16);
                          label = `Overdue ${overdue} days`;
                        } else if (daysLeft === 0) {
                          // Due today - orange chip
                          colorHex = '#FFB37A';
                          bg = alpha('#FFB37A', 0.16);
                          label = 'Due today';
                        } else {
                          // X days left - lime
                          label = `${daysLeft} days left`;
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
                      variant='contained'
                      size='small'
                      onClick={(e) => e.stopPropagation()}
                      sx={{
                        bgcolor: ui.neutral,
                        color: ui.text,
                        textTransform: 'none',
                        borderRadius: 9999,
                        boxShadow: 'none',
                        border: `1px solid ${ui.border}`,
                        height: 32,
                        px: 1.5,
                        '&:hover': {
                          bgcolor: '#353A42',
                          boxShadow: 'none',
                          borderColor: ui.border,
                        },
                      }}
                    >
                      Extend
                    </Button>
                    <Button
                      variant='contained'
                      size='small'
                      onClick={(e) => e.stopPropagation()}
                      sx={{
                        bgcolor: ui.primary,
                        color: '#0A0A0A',
                        textTransform: 'none',
                        borderRadius: 9999,
                        height: 32,
                        px: 1.5,
                        '&:hover': {
                          bgcolor: ui.primaryHover,
                        },
                      }}
                    >
                      Return
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Card>
          ))
        ) : (
          <Typography variant='body2' color='text.secondary'>
            You're not borrowing anything yet.
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default BorrowedSection;
