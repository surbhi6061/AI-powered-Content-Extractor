import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

function ContentTable({ data }) {
  const [filter, setFilter] = useState('');

  const filtered = data.filter(d =>
    d.summary.toLowerCase().includes(filter.toLowerCase()) ||
    d.url.toLowerCase().includes(filter.toLowerCase())
  );

  const columns = [
    {
      field: 'url',
      headerName: '🔗 URL',
      flex: 2,
      minWidth: 250,
      renderCell: (params) => (
        <a
          href={params.value}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#2563eb',
            textDecoration: 'none',
            fontSize: '0.875rem',
            wordBreak: 'break-word',
            whiteSpace: 'normal',
          }}
        >
          {params.value}
        </a>
      ),
    },
    {
      field: 'summary',
      headerName: '📝 Summary',
      flex: 3,
      minWidth: 350,
      renderCell: (params) => (
        <div style={{
          fontSize: '0.875rem',
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          lineHeight: 1.6,
          color: '#334155'
        }}>
          {params.value}
        </div>
      ),
    },
    {
      field: 'key_points',
      headerName: '📌 Key Points',
      flex: 3,
      minWidth: 350,
      renderCell: (params) => (
        <ul style={{
          paddingLeft: '1.25rem',
          margin: 0,
          fontSize: '0.875rem',
          lineHeight: 1.6,
          color: '#475569'
        }}>
          {params.value.map((pt, idx) => (
            <li key={idx} style={{ marginBottom: 4 }}>{pt}</li>
          ))}
        </ul>
      ),
    },
  ];

  const rows = filtered.map((item, index) => ({
    id: index,
    ...item,
  }));

  return (
    <Box sx={{ px: 3, py: 4, fontFamily: 'Inter, sans-serif' }}>
      <Typography
        variant="h5"
        sx={{ mb: 3, fontWeight: 600, color: '#0f172a' }}
      >
        📄 Extracted Articles
      </Typography>

      <TextField
        fullWidth
        placeholder="🔍 Search by URL or Summary..."
        variant="outlined"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            fontSize: '0.9rem',
          },
        }}
      />

      <Box
        sx={{
          width: '100%',
          backgroundColor: '#ffffff',
          borderRadius: 2,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          autoHeight
          disableColumnMenu
          disableSelectionOnClick
          getRowHeight={() => 'auto'}
          sx={{
            border: 'none',
            fontFamily: 'Inter, sans-serif',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f8fafc',
              fontWeight: 600,
              fontSize: '0.875rem',
              color: '#1e293b',
              borderBottom: '1px solid #e2e8f0',
              height: '56px',
            },
            '& .MuiDataGrid-cell': {
              whiteSpace: 'normal !important',
              wordBreak: 'break-word',
              lineHeight: 1.6,
              fontSize: '0.875rem',
              paddingTop: '12px',
              paddingBottom: '12px',
              paddingLeft: '16px',
              paddingRight: '16px',
              borderBottom: '1px solid #f1f5f9',
              alignItems: 'flex-start',
              color: '#334155',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#f9fafb',
            },
            '& .MuiDataGrid-virtualScroller': {
              backgroundColor: '#ffffff',
            },
            '& .MuiDataGrid-footerContainer': {
              backgroundColor: '#f9fafb',
              borderTop: '1px solid #e2e8f0',
            }
          }}
        />
      </Box>
    </Box>
  );
}

export default ContentTable;
