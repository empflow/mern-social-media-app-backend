export default function getEnvVar(envVarName: string) {
  const envVar = process.env[envVarName];
  if (!envVar) throw new Error(`${envVarName} env variable is undefined`);

  return envVar;
}