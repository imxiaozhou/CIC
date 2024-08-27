import { defineConfig, loadEnv, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import AutoImport from 'unplugin-auto-import/vite';
// import { theme } from 'antd';

// const { getDesignToken } = theme;
// const { colorPrimary } = getDesignToken();

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode (development or production)
  const env = loadEnv(mode, process.cwd());

  return {
    define: {
      'process.env.VITE_SMA_APP_KEYCLOAK_URL': JSON.stringify(
        process.env.VITE_SMA_APP_KEYCLOAK_URL
      )
    },
    server: {
      port: 3000,
      // 跑dev:nginx 指令时，这里的proxy配置注释掉
      // 停止本地nginx 时，在本地nginx目录执行  nginx -s stop, 才能释放出被占用的3000端口
      proxy: {
        '/sma-adm': {
          target:
            process.env.REACT_SMA_APP_BACKEND_URL || 'http://10.89.104.58:8080',
          changeOrigin: true
        }
      },

      open: false
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        scan: resolve(__dirname, './scan')
      }
    },
    plugins: [
      react(),
      splitVendorChunkPlugin(),
      AutoImport({
        imports: ['react'],
        dts: 'src/auto-imports.d.ts',
        dirs: ['src/hooks', 'src/locales', 'src/store/reducer'],
        eslintrc: {
          enabled: true, // Default `false`
          filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
          globalsPropValue: true // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
        }
      })
    ],
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            '@primary-color': '#0A52C6'
          },
          javascriptEnabled: true
        }
      }
    }
  };
});
