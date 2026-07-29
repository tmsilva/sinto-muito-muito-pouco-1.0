import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('==================================================');
console.log('   Sinto Muito (Muito Pouco) - Validador de Ambiente');
console.log('==================================================\n');

let success = true;

// 1. Validar dependências no package.json
console.log('1. Verificando dependências no package.json...');
try {
  const pkgPath = path.join(rootDir, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const requiredDeps = ['@supabase/supabase-js', 'react-router-dom'];
  const requiredDevDeps = ['vitest', 'jsdom'];

  requiredDeps.forEach(dep => {
    if (pkg.dependencies && pkg.dependencies[dep]) {
      console.log(`   [OK] Dependência "${dep}" declarada.`);
    } else {
      console.error(`   [ERRO] Dependência "${dep}" não encontrada em package.json.`);
      success = false;
    }
  });

  requiredDevDeps.forEach(dep => {
    if (pkg.devDependencies && pkg.devDependencies[dep]) {
      console.log(`   [OK] DevDependência "${dep}" declarada.`);
    } else {
      console.error(`   [ERRO] DevDependência "${dep}" não encontrada em package.json.`);
      success = false;
    }
  });
} catch (err) {
  console.error('   [ERRO] Falha ao ler ou analisar o arquivo package.json:', err.message);
  success = false;
}

// 2. Carregar e Validar variáveis de ambiente (.env ou .env.local)
console.log('\n2. Verificando arquivo de variáveis de ambiente (.env / .env.local)...');
let envUrl = '';
let envKey = '';

function loadEnvFile(fileName) {
  const envPath = path.join(rootDir, fileName);
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    lines.forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const val = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
        if (key === 'VITE_SUPABASE_URL') envUrl = val;
        if (key === 'VITE_SUPABASE_ANON_KEY') envKey = val;
      }
    });
    return true;
  }
  return false;
}

const loadedLocal = loadEnvFile('.env.local');
const loadedEnv = loadEnvFile('.env');

if (loadedLocal) {
  console.log('   [OK] Arquivo .env.local carregado.');
} else if (loadedEnv) {
  console.log('   [OK] Arquivo .env carregado.');
} else {
  console.warn('   [AVISO] Nenhum arquivo .env ou .env.local encontrado na raiz.');
  console.log('   [DICA] Crie um arquivo .env ou .env.local com VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.');
}

if (!envUrl) {
  console.error('   [ERRO] VITE_SUPABASE_URL está ausente ou vazia.');
  success = false;
} else {
  console.log(`   [OK] VITE_SUPABASE_URL configurada: ${envUrl}`);
}

if (!envKey) {
  console.error('   [ERRO] VITE_SUPABASE_ANON_KEY está ausente ou vazia.');
  success = false;
} else {
  console.log('   [OK] VITE_SUPABASE_ANON_KEY configurada (comprimento: ' + envKey.length + ' caracteres).');
}

// 3. Testar Conexão com o Supabase
console.log('\n3. Testando conexão com o Supabase...');
if (!envUrl || !envKey) {
  console.error('   [ERRO] Conexão não pode ser testada por falta de variáveis de ambiente.');
  success = false;
} else {
  const restUrl = `${envUrl.replace(/\/$/, '')}/rest/v1/?apikey=${envKey}`;
  
  try {
    const response = await fetch(restUrl, { method: 'GET' });
    if (response.ok) {
      console.log('   [OK] Conexão com o Supabase estabelecida com sucesso!');
    } else {
      console.error(`   [ERRO] Erro na resposta do Supabase API. Status: ${response.status} ${response.statusText}`);
      success = false;
    }
  } catch (err) {
    console.error('   [ERRO] Não foi possível conectar ao Supabase:', err.message);
    success = false;
  }
}

console.log('\n==================================================');
if (success) {
  console.log('   Validação concluída: AMBIENTE OK!');
  process.exit(0);
} else {
  console.error('   Validação concluída: AMBIENTE COM ERROS!');
  process.exit(1);
}
