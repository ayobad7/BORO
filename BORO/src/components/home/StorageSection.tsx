import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
// import IconButton from '@mui/material/IconButton';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import type { StorageItem } from '../../types';
import { GrLocation } from 'react-icons/gr';
import { BiCategoryAlt } from 'react-icons/bi';
import { LuShare2 } from 'react-icons/lu';
import { GrFavorite } from 'react-icons/gr';
import { CgAdd } from 'react-icons/cg';
import { ui, alpha } from '../../lib/uiTokens';
import MetaRow from '../MetaRow';
import { formatShortDate } from '../../lib/date';

export function StorageSection({ items }: { items: StorageItem[] }) {
  const navigate = useNavigate();
  const hasRecent = items.length > 0;
  return (
    <Box sx={{ mb: { xs: 4, sm: 5, md: 6 } }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Box>
          <Typography variant='h4' fontWeight={700} color={ui.text}>
            Storage
          </Typography>
          <Typography
            variant='body2'
            sx={{ color: ui.text, opacity: 0.9, fontSize: 24 }}
          >
            Recently added stuff
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            component={RouterLink}
            to='/item/new'
            variant='contained'
            size='small'
            sx={{
              bgcolor: ui.primary,
              color: '#0A0A0A',
              '&:hover': { bgcolor: ui.primaryHover },
              textTransform: 'none',
              borderRadius: 9999,
              fontWeight: 700,
              height: 32,
              px: 1.5,
            }}
          >
            <CgAdd size={18} style={{ marginRight: 6 }} /> Add Item
          </Button>
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
              height: 32,
              px: 1.5,
            }}
          >
            View All
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 2,
        }}
      >
        {hasRecent ? (
          items.slice(0, 3).map((item) => (
            <Card
              key={item.id}
              onClick={() => navigate(`/item/${item.id}`)}
              sx={{
                bgcolor: '#0f0f10',
                background: '#0f0f10',
                backgroundImage: 'none',
                color: ui.text,
                borderRadius: 2,
                boxShadow: 'none',
                border: `1px solid ${ui.border}`,
                cursor: 'pointer',
              }}
            >
              <Box sx={{ p: 1.5 }}>
                <Box
                  sx={{
                    display: 'block',
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  <Box
                    sx={{
                      border: `1px solid ${ui.border}`,
                      borderRadius: 1.2,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        width: '100%',
                        aspectRatio: '1',
                        bgcolor: '#424242',
                        backgroundImage: item.imageUrls?.[0]
                          ? `url(${item.imageUrls[0]})`
                          : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                  </Box>
                </Box>
              </Box>
              <Box
                sx={{
                  px: 1.5,
                  pb: 1.5,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.25,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    gap: 1,
                    mb: 0.75,
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
                      flex: '1 1 auto',
                      minWidth: 0,
                    }}
                  >
                    {item.title}
                  </Typography>
                  {(() => {
                    const d = formatShortDate(item.createdAt as unknown);
                    return d ? (
                      <Typography
                        variant='caption'
                        sx={{
                          color: ui.subtext,
                          fontSize: 12,
                          whiteSpace: 'nowrap',
                          ml: 1,
                          flexShrink: 0,
                        }}
                      >
                        {d}
                      </Typography>
                    ) : null;
                  })()}
                </Box>
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
                    <GrLocation style={{ fontSize: 14, color: ui.subtext }} />
                  }
                  label='Location'
                  value={item.location || '—'}
                />
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mt: 1.25,
                  }}
                >
                  <Button
                    size='small'
                    onClick={(e) => e.stopPropagation()}
                    startIcon={<LuShare2 size={16} />}
                    sx={{
                      bgcolor: alpha(ui.primary, 0.12),
                      color: ui.primary,
                      borderRadius: 9999,
                      fontWeight: 700,
                      textTransform: 'none',
                      px: 1.5,
                      height: 32,
                      flex: 1,
                      '&:hover': { bgcolor: alpha(ui.primary, 0.18) },
                    }}
                  >
                    Share
                  </Button>
                  <Button
                    size='small'
                    onClick={(e) => e.stopPropagation()}
                    startIcon={<GrFavorite size={16} />}
                    sx={{
                      bgcolor: alpha(ui.primary, 0.12),
                      color: ui.primary,
                      borderRadius: 9999,
                      fontWeight: 700,
                      textTransform: 'none',
                      px: 1.5,
                      height: 32,
                      flex: 1,
                      '&:hover': { bgcolor: alpha(ui.primary, 0.18) },
                    }}
                  >
                    Favorite
                  </Button>
                </Box>
              </Box>
            </Card>
          ))
        ) : (
          <Typography variant='body2' color='text.secondary'>
            No recent items
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default StorageSection;
