{{- define "cyberlearn.fullname" -}}
{{- .Release.Name | trunc 50 | trimSuffix "-" -}}
{{- end -}}

{{- define "cyberlearn.labels" -}}
app.kubernetes.io/name: {{ .Chart.Name }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Values.image.tag | default .Chart.AppVersion | trunc 63 | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
helm.sh/chart: {{ printf "%s-%s" .Chart.Name .Chart.Version }}
{{- end -}}

{{/* Usage: include "cyberlearn.selectorLabels" (list . "api") */}}
{{- define "cyberlearn.selectorLabels" -}}
{{- $root := index . 0 -}}
app.kubernetes.io/name: {{ $root.Chart.Name }}
app.kubernetes.io/instance: {{ $root.Release.Name }}
app.kubernetes.io/component: {{ index . 1 }}
{{- end -}}

{{- define "cyberlearn.image" -}}
{{- required "image.repository is required" .Values.image.repository }}:{{ required "image.tag is required" .Values.image.tag }}
{{- end -}}

{{- define "cyberlearn.envSecret" -}}
{{ include "cyberlearn.fullname" . }}-env
{{- end -}}

{{/* Shared by every container that runs the API image. */}}
{{- define "cyberlearn.env" -}}
envFrom:
  - configMapRef:
      name: {{ include "cyberlearn.fullname" . }}-config
  - secretRef:
      name: {{ include "cyberlearn.envSecret" . }}
env:
  - name: APP_VERSION
    value: {{ .Values.image.tag | quote }}
{{- end -}}

{{- define "cyberlearn.podSecurityContext" -}}
runAsNonRoot: true
runAsUser: 1000
runAsGroup: 1000
fsGroup: 1000
seccompProfile:
  type: RuntimeDefault
{{- end -}}

{{- define "cyberlearn.containerSecurityContext" -}}
allowPrivilegeEscalation: false
readOnlyRootFilesystem: true
capabilities:
  drop: ["ALL"]
{{- end -}}

{{/* Checksums make pods restart when config changes. */}}
{{- define "cyberlearn.podAnnotations" -}}
checksum/config: {{ include (print $.Template.BasePath "/configmap.yaml") . | sha256sum }}
checksum/secret-source: {{ include (print $.Template.BasePath "/externalsecret.yaml") . | sha256sum }}
{{- end -}}
